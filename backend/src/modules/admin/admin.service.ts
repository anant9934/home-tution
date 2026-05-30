import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    // Platform Stats
    const totalStudents = await this.prisma.studentProfile.count();
    const totalTutors = await this.prisma.tutorProfile.count({ where: { verificationStatus: 'VERIFIED' } });
    const totalCourses = await this.prisma.course.count();
    
    // Revenue Calculation (Sum of all completed bookings)
    const completedBookings = await this.prisma.booking.findMany({
      where: { status: 'COMPLETED' },
      include: { tutor: true }
    });
    
    let totalRevenue = 0;
    completedBookings.forEach(b => {
      totalRevenue += (b.duration / 60) * b.tutor.hourlyRate;
    });

    // Pending Tutors
    const pendingTutors = await this.prisma.tutorProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      include: { user: true },
      take: 5
    });

    // Recent Bookings
    const recentBookings = await this.prisma.booking.findMany({
      orderBy: { scheduledAt: 'desc' },
      include: { student: { include: { user: true } }, tutor: { include: { user: true } } },
      take: 5
    });

    return {
      stats: {
        totalStudents,
        totalTutors,
        totalCourses,
        totalRevenue: `₹${(totalRevenue / 1000).toFixed(1)}k`
      },
      pendingTutors: pendingTutors.map(t => ({
        id: t.id,
        name: t.user.name,
        subject: 'General', // Would be derived from tutor subjects
        docStatus: t.verificationStatus,
        appliedAt: t.user.createdAt
      })),
      recentBookings: recentBookings.map(b => ({
        id: b.id,
        student: b.student.user.name,
        tutor: b.tutor.user.name,
        amount: `₹${((b.duration / 60) * b.tutor.hourlyRate).toFixed(0)}`,
        status: b.status
      }))
    };
  }

  async updateTutorStatus(id: string, status: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { id } });
    if (!tutor) {
      throw new Error('Tutor not found');
    }
    return this.prisma.tutorProfile.update({
      where: { id },
      data: { verificationStatus: status, isVerified: status === 'VERIFIED' }
    });
  }

  async createCourse(data: { title: string; subject: string; instructor: string }) {
    // For instructor we are assuming Admin assigns a tutor by name for mock, 
    // but in reality we should find a tutor.
    const tutor = await this.prisma.tutorProfile.findFirst({
      where: { user: { name: data.instructor } }
    });
    
    // Fallback to any verified tutor if not found by name
    const tutorId = tutor ? tutor.id : (await this.prisma.tutorProfile.findFirst({ where: { isVerified: true } }))?.id;
    
    if (!tutorId) {
       throw new Error("No verified tutor available to assign to this course.");
    }

    return this.prisma.course.create({
      data: {
        title: data.title,
        subject: data.subject,
        class: "General", // Default for now
        board: "General", // Default for now
        createdBy: tutorId,
        isPublished: true,
      }
    });
  }
}
