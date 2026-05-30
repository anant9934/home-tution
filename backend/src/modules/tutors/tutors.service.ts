import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TutorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        bookings: {
          orderBy: { scheduledAt: 'asc' },
          include: { student: { include: { user: true } } }
        },
        user: true
      }
    });

    if (!tutor) {
      throw new NotFoundException('Tutor profile not found');
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayBookings = tutor.bookings.filter(
      b => b.scheduledAt >= todayStart && b.scheduledAt <= todayEnd
    );

    // Calculate unique students
    const uniqueStudents = new Set(tutor.bookings.map(b => b.studentId));

    // Calculate earnings for the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const completedBookingsThisMonth = tutor.bookings.filter(
      b => b.status === 'COMPLETED' && b.scheduledAt >= startOfMonth
    );
    
    // Earnings: duration (mins) / 60 * hourlyRate
    const monthlyEarnings = completedBookingsThisMonth.reduce(
      (sum, b) => sum + (b.duration / 60) * tutor.hourlyRate, 0
    );

    // Mocking pending tasks for now (since Submission doesn't directly link to Tutor in our current schema, it links to Assignment -> Course -> Creator)
    const pendingTasks = [
      { id: '1', title: 'Grade Calculus Test', desc: '45 pending submissions', type: 'Assignment' },
      { id: '2', title: 'Approve Demo Request', desc: 'Rahul Sharma (Class 10)', type: 'Demo' },
    ];

    return {
      tutor: {
        id: tutor.id,
        name: tutor.user.name,
      },
      stats: {
        totalStudents: uniqueStudents.size,
        todaysClasses: todayBookings.length,
        pendingTasksCount: pendingTasks.length,
        monthlyEarnings: `₹${(monthlyEarnings / 1000).toFixed(1)}k` // format as ₹45k
      },
      schedule: todayBookings.map(b => ({
        id: b.id,
        title: `${b.bookingType === 'ONE_ON_ONE' ? '1-on-1 Tuition' : 'Group Batch'}`,
        type: b.bookingType === 'ONE_ON_ONE' ? '1-on-1 Tuition' : 'Group Batch',
        students: b.bookingType === 'ONE_ON_ONE' ? 1 : 24, // Mock group size
        time: b.scheduledAt,
        duration: `${b.duration / 60}h`,
        status: b.status,
        meetingLink: b.meetingLink
      })),
      actionRequired: pendingTasks
    };
  }

  async getPublicTutors() {
    const tutors = await this.prisma.tutorProfile.findMany({
      where: { verificationStatus: 'VERIFIED' },
      include: {
        user: { select: { name: true } },
      }
    });

    return tutors.map(t => ({
      id: t.id,
      name: t.user.name,
      subjects: ['Mathematics', 'Physics'], // Currently mocked until subjects are added to schema
      qualification: t.qualification,
      experience: `${t.experienceYears} years`,
      hourlyRate: `₹${t.hourlyRate}`,
      rating: 4.8,
      reviews: 124,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.user.name.replace(' ', '')}`,
      isVerified: t.verificationStatus === 'VERIFIED'
    }));
  }

  create(createTutorDto: CreateTutorDto) {
    return 'This action adds a new tutor';
  }

  findAll() {
    return `This action returns all tutors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tutor`;
  }

  update(id: number, updateTutorDto: UpdateTutorDto) {
    return `This action updates a #${id} tutor`;
  }

  remove(id: number) {
    return `This action removes a #${id} tutor`;
  }
}
