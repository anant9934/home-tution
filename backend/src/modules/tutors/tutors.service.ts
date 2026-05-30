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

    // Fetch pending demo/bookings for this tutor to show in actionRequired
    const pendingBookings = await this.prisma.booking.findMany({
      where: {
        tutorId: tutor.id,
        status: 'PENDING'
      },
      include: { student: { include: { user: true } } }
    });

    const pendingTasks = pendingBookings.map(b => ({
      id: b.id,
      title: 'Approve Demo Request',
      desc: `${b.student.user.name} (${b.bookingType})`,
      type: 'Demo',
      bookingId: b.id
    }));

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

  async getPublicTutorDetails(tutorId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: { user: { select: { name: true } } }
    });

    if (!tutor) throw new NotFoundException('Tutor not found');

    return {
      id: tutor.id,
      name: tutor.user.name,
      subjects: ['Mathematics', 'Physics'], // Currently mocked subjects
      qualification: tutor.qualification,
      experience: `${tutor.experienceYears} years`,
      hourlyRate: tutor.hourlyRate,
      rating: 4.8,
      reviews: 124,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.user.name.replace(' ', '')}`,
      isVerified: tutor.verificationStatus === 'VERIFIED',
      location: 'Remote',
      about: tutor.bio || `I am an experienced educator passionate about teaching. I focus on building strong fundamentals and helping students achieve their academic goals.`,
    };
  }

  async bookDemo(userId: string, tutorId: string, slotIndex: number) {
    // Determine student ID
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new Error("Only students can book demos.");

    // Parse mock slot to a real Date (e.g. tomorrow)
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 1);
    scheduledAt.setHours(16 + slotIndex, 0, 0, 0); // Mock hour based on slot

    return this.prisma.booking.create({
      data: {
        tutorId,
        studentId: student.id,
        bookingType: 'ONE_ON_ONE',
        scheduledAt,
        duration: 60,
        status: 'PENDING',
        meetingLink: null, // Will be generated when confirmed
      }
    });
  }

  async updateBookingStatus(bookingId: string, status: string) {
    // status should be mapped to BookingStatus (CONFIRMED, CANCELLED, etc)
    let bookingStatus: any = 'CONFIRMED';
    if (status === 'REJECTED' || status === 'CANCELLED') bookingStatus = 'CANCELLED';
    
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: bookingStatus }
    });
  }

  async scheduleClass(userId: string, data: { title: string; studentName: string; time: string }) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    // Find student by name (mock-like behavior, in real app would use student ID)
    const student = await this.prisma.studentProfile.findFirst({
      where: { user: { name: data.studentName } }
    });
    
    const studentId = student ? student.id : (await this.prisma.studentProfile.findFirst())?.id;
    if (!studentId) throw new Error("No student available to assign to this class.");

    // Parse time roughly
    let scheduledAt = new Date();
    if (data.time.toLowerCase().includes('tomorrow')) {
       scheduledAt.setDate(scheduledAt.getDate() + 1);
    }
    
    return this.prisma.booking.create({
      data: {
        tutorId: tutor.id,
        studentId: studentId,
        bookingType: 'GROUP_BATCH',
        scheduledAt: scheduledAt,
        duration: 60,
        status: 'CONFIRMED',
        meetingLink: 'https://meet.google.com/mock-link',
      }
    });
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
