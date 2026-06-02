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
        user: { select: { name: true, avatarUrl: true } },
        studentsAssigned: { select: { id: true } },
      }
    });

    return tutors.map(t => ({
      id: t.id,
      user: {
        name: t.user.name,
        avatarUrl: t.user.avatarUrl,
      },
      subjects: t.subjects.length > 0 ? t.subjects : [],
      qualification: t.qualification || null,
      experienceYears: t.experienceYears || 0,
      hourlyRate: t.hourlyRate || 0,
      rating: t.rating || null,
      totalReviews: t.totalReviews || 0,
      bio: t.bio || null,
      teachingMode: t.teachingMode || 'BOTH',
      isVerified: true,
      totalStudents: t.studentsAssigned.length,
    }));
  }

  async getPublicTutorDetails(tutorId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: {
        user: { select: { name: true, avatarUrl: true, email: true } },
        studentsAssigned: { select: { id: true } },
      }
    });

    if (!tutor) throw new NotFoundException('Tutor not found');

    return {
      id: tutor.id,
      user: {
        name: tutor.user.name,
        avatarUrl: tutor.user.avatarUrl,
      },
      subjects: tutor.subjects.length > 0 ? tutor.subjects : [],
      qualification: tutor.qualification || null,
      experienceYears: tutor.experienceYears || 0,
      hourlyRate: tutor.hourlyRate || 0,
      rating: tutor.rating || null,
      totalReviews: tutor.totalReviews || 0,
      bio: tutor.bio || null,
      teachingMode: tutor.teachingMode || 'BOTH',
      isVerified: true,
      totalStudents: tutor.studentsAssigned.length,
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

  async scheduleClass(userId: string, data: {
    studentId: string;
    subject: string;
    scheduledAt: string;
    duration: number;
    location?: string;
    notes?: string;
  }) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    const student = await this.prisma.studentProfile.findUnique({ where: { id: data.studentId } });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.booking.create({
      data: {
        tutorId: tutor.id,
        studentId: data.studentId,
        bookingType: 'ONE_ON_ONE',
        scheduledAt: new Date(data.scheduledAt),
        duration: Number(data.duration) || 60,
        status: 'CONFIRMED',
        meetingLink: data.location || null,
      },
      include: {
        student: { include: { user: { select: { name: true } } } }
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
        userId: student.userId, // needed for messaging
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
        submissions: { include: { student: { include: { user: true } } } }
      }
    });
  }

  async createAssignment(userId: string, data: any) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    return this.prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        studentId: data.studentId, // Support for direct student assignment
        createdBy: tutor.id,
        deadline: new Date(data.deadline),
        maxMarks: Number(data.maxMarks),
        attachmentUrl: data.attachmentUrl || null
      }
    });
  }

  async gradeSubmission(userId: string, submissionId: string, data: any) {
     const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
     if (!tutor) throw new NotFoundException('Tutor not found');

     return this.prisma.submission.update({
       where: { id: submissionId },
       data: { 
         marks: Number(data.marks), 
         feedback: data.feedback 
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
        attempts: { include: { student: { include: { user: true } } } },
        questions: { select: { id: true, questionText: true, options: true, correctAnswer: true, marks: true } }
      }
    });
  }

  async createQuiz(userId: string, data: any) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    return this.prisma.quiz.create({
      data: {
        title: data.title,
        studentId: data.studentId, // Support for direct student assignment
        duration: Number(data.duration),
        totalMarks: Number(data.totalMarks),
        createdBy: tutor.id,
        startTime: new Date()
      }
    });
  }

  async addQuestionsToQuiz(userId: string, quizId: string, questions: any[]) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    const quiz = await this.prisma.quiz.findFirst({ where: { id: quizId, createdBy: tutor.id } });
    if (!quiz) throw new NotFoundException('Quiz not found');

    // Delete existing questions for this quiz to replace them, or just insert new ones
    await this.prisma.question.deleteMany({ where: { quizId } });

    const created: any[] = [];
    for (const q of questions) {
      created.push(await this.prisma.question.create({
        data: {
          quizId,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: String(q.correctAnswer),
          marks: Number(q.marks || 1)
        }
      }));
    }
    return created;
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

  async getStudentAttendance(userId: string, studentId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    return this.prisma.attendance.findMany({
      where: { markedBy: tutor.id, studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        student: { include: { user: { select: { name: true } } } },
        session: { include: { booking: { select: { scheduledAt: true } } } }
      }
    });
  }

  async markAttendance(userId: string, data: { bookingId: string, status: string }) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    const booking = await this.prisma.booking.findFirst({
      where: { id: data.bookingId, tutorId: tutor.id }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    // Find or create ClassSession for this booking
    let session = await this.prisma.classSession.findFirst({
      where: { bookingId: booking.id }
    });

    if (!session) {
      session = await this.prisma.classSession.create({
        data: {
          bookingId: booking.id,
          attendanceStatus: 'COMPLETED'
        }
      });
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        studentId: booking.studentId,
        classSessionId: session.id,
        status: data.status as any,
        markedBy: tutor.id
      }
    });

    if (data.status === 'PRESENT') {
      await this.prisma.xP.create({
        data: {
          studentId: booking.studentId,
          points: 20,
          source: 'ATTENDANCE'
        }
      });
    }

    return attendance;
  }

  async getEarnings(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({ 
      where: { userId },
      include: { bookings: true }
    });
    if (!tutor) throw new NotFoundException('Tutor not found');

    const completedBookings = tutor.bookings.filter(b => b.status === 'COMPLETED');
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.duration / 60) * tutor.hourlyRate, 0);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyEarnings = completedBookings.filter(b => b.scheduledAt >= startOfMonth)
      .reduce((sum, b) => sum + (b.duration / 60) * tutor.hourlyRate, 0);

    // Build daily earnings for last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const weeklyBreakdown = last7.map(day => {
      const dayBookings = completedBookings.filter(b => {
        const bd = new Date(b.scheduledAt);
        return bd.getFullYear() === day.getFullYear() &&
               bd.getMonth() === day.getMonth() &&
               bd.getDate() === day.getDate();
      });
      const amount = dayBookings.reduce((sum, b) => sum + (b.duration / 60) * tutor.hourlyRate, 0);
      return { day: days[day.getDay()], amount };
    });

    return {
      totalEarnings,
      monthlyEarnings,
      hourlyRate: tutor.hourlyRate,
      completedClasses: completedBookings.length,
      weeklyBreakdown,
      history: completedBookings.slice(-10).reverse().map(b => ({
        id: b.id,
        date: b.scheduledAt,
        amount: Math.round((b.duration / 60) * tutor.hourlyRate),
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

  async sendNotification(userId: string, data: { title: string, message: string }) {
    const tutor = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutor) throw new NotFoundException('Tutor not found');

    // Get all students associated with this tutor (via bookings)
    const bookings = await this.prisma.booking.findMany({
      where: { tutorId: tutor.id },
      select: { student: { select: { userId: true } } },
      distinct: ['studentId']
    });

    if (bookings.length === 0) return { success: true, count: 0 };

    const notifications = bookings.map(b => ({
      userId: b.student.userId,
      title: data.title,
      message: data.message,
      type: 'ANNOUNCEMENT',
      isRead: false
    }));

    await this.prisma.notification.createMany({
      data: notifications
    });

    return { success: true, count: notifications.length };
  }
}
