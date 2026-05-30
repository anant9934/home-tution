import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TutorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService
  ) {}

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
    const student = await this.prisma.studentProfile.findUnique({ 
      where: { userId },
      include: { user: true }
    });
    if (!student) throw new Error("Only students can book demos.");

    // Parse mock slot to a real Date (e.g. tomorrow)
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 1);
    scheduledAt.setHours(16 + slotIndex, 0, 0, 0); // Mock hour based on slot

    const booking = await this.prisma.booking.create({
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

    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: { user: true }
    });

    if (tutorProfile && tutorProfile.user.email) {
      this.mailService.sendDemoRequestEmail(tutorProfile.user.email, student.user.name);
    }

    return booking;
  }

  async updateBookingStatus(bookingId: string, status: string, meetingLink?: string) {
    // status should be mapped to BookingStatus (CONFIRMED, CANCELLED, etc)
    let bookingStatus: any = 'CONFIRMED';
    if (status === 'REJECTED' || status === 'CANCELLED') bookingStatus = 'CANCELLED';
    
    const updateData: any = { status: bookingStatus };
    if (meetingLink && bookingStatus === 'CONFIRMED') {
      updateData.meetingLink = meetingLink;
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        tutor: { include: { user: true } },
        student: { include: { user: true } }
      }
    });

    if (bookingStatus === 'CONFIRMED' && updatedBooking.student.user.email) {
      this.mailService.sendDemoAcceptedEmail(
        updatedBooking.student.user.email,
        updatedBooking.tutor.user.name,
        updatedBooking.meetingLink || 'Link will be provided soon'
      );
    }

    return updatedBooking;
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

  async getStudents(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    const bookings = await this.prisma.booking.findMany({
      where: { tutorId: tutor.id },
      include: { 
        student: { 
          include: { 
            user: { select: { name: true, email: true, phone: true } },
            lessonProgress: true,
            xp: true
          }
        } 
      },
      distinct: ['studentId']
    });

    return bookings.map(b => {
      const student = b.student;
      const totalXp = student.xp.reduce((sum, x) => sum + x.points, 0);
      const completedLessons = student.lessonProgress.filter(lp => lp.completed).length;
      return {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
        phone: student.user.phone,
        class: student.class,
        board: student.board,
        totalXp,
        completedLessons,
        joiningDate: student.joiningDate
      };
    });
  }

  async getClasses(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    const bookings = await this.prisma.booking.findMany({
      where: { tutorId: tutor.id },
      orderBy: { scheduledAt: 'desc' },
      include: {
        student: { include: { user: { select: { name: true } } } },
        classSession: true
      }
    });

    return bookings.map(b => ({
      id: b.id,
      title: b.bookingType === 'ONE_ON_ONE' ? '1-on-1 Tuition' : 'Group Batch',
      student: b.student.user.name,
      scheduledAt: b.scheduledAt,
      duration: b.duration,
      status: b.status,
      meetingLink: b.meetingLink,
      recordingUrl: b.classSession?.recordingUrl || null
    }));
  }

  async getAssignments(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    return this.prisma.assignment.findMany({
      where: { createdBy: tutor.id },
      orderBy: { deadline: 'desc' },
      include: {
        course: { select: { title: true } },
        submissions: true
      }
    });
  }

  async getQuizzes(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    return this.prisma.quiz.findMany({
      where: { createdBy: tutor.id },
      orderBy: { startTime: 'desc' },
      include: {
        course: { select: { title: true } },
        attempts: true,
        questions: { select: { id: true } }
      }
    });
  }

  async getAttendance(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    return this.prisma.attendance.findMany({
      where: { markedBy: tutor.id },
      orderBy: { createdAt: 'desc' },
      include: {
        student: { include: { user: { select: { name: true } } } },
        session: { include: { booking: { select: { scheduledAt: true } } } }
      }
    });
  }

  async getEarnings(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ 
      where: { userId },
      include: { bookings: true }
    });
    if (!tutor) throw new NotFoundException('Tutor not found');

    // Aggregate earnings
    const completedBookings = tutor.bookings.filter(b => b.status === 'COMPLETED');
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.duration / 60) * tutor.hourlyRate, 0);

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonthBookings = completedBookings.filter(b => b.scheduledAt >= startOfMonth);
    const monthlyEarnings = thisMonthBookings.reduce((sum, b) => sum + (b.duration / 60) * tutor.hourlyRate, 0);

    return {
      totalEarnings,
      monthlyEarnings,
      hourlyRate: tutor.hourlyRate,
      completedClasses: completedBookings.length,
      history: completedBookings.slice(-10).map(b => ({
        id: b.id,
        date: b.scheduledAt,
        amount: (b.duration / 60) * tutor.hourlyRate,
        status: b.paymentStatus
      }))
    };
  }

  async getProfile(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId },
      include: { user: { select: { name: true, email: true, phone: true } } }
    });
    if (!tutor) throw new NotFoundException('Tutor not found');
    return tutor;
  }

  async updateProfile(userId: string, data: any) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    const updateData: any = {};
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.experienceYears !== undefined) updateData.experienceYears = parseInt(data.experienceYears);
    if (data.qualification !== undefined) updateData.qualification = data.qualification;
    if (data.hourlyRate !== undefined) updateData.hourlyRate = parseFloat(data.hourlyRate);
    if (data.languages !== undefined) updateData.languages = Array.isArray(data.languages) ? data.languages : data.languages.split(',').map((s:string) => s.trim());
    if (data.subjects !== undefined) updateData.subjects = Array.isArray(data.subjects) ? data.subjects : data.subjects.split(',').map((s:string) => s.trim());
    if (data.teachingMode !== undefined) updateData.teachingMode = data.teachingMode;
    if (data.introVideoUrl !== undefined) updateData.introVideoUrl = data.introVideoUrl;

    if (data.name || data.phone) {
       const userUpdate: any = {};
       if (data.name) userUpdate.name = data.name;
       if (data.phone) userUpdate.phone = data.phone;
       await this.prisma.user.update({
          where: { id: userId },
          data: userUpdate
       });
    }

    return this.prisma.tutorProfile.update({
      where: { id: tutor.id },
      data: updateData
    });
  }
}
