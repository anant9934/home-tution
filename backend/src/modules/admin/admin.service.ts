import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'platform-settings.json');

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    // Platform Stats
    const totalStudents = await this.prisma.studentProfile.count();
    const totalTutors = await this.prisma.tutorProfile.count({ where: { verificationStatus: 'VERIFIED' } });
    const totalCourses = await this.prisma.course.count();
    
    // Revenue Calculation (Sum of all SUCCESS payments)
    const successPayments = await this.prisma.payment.findMany({
      where: { status: 'SUCCESS' }
    });
    
    let totalRevenue = 0;
    successPayments.forEach(p => {
      totalRevenue += p.amount;
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
        subject: t.subjects.length > 0 ? t.subjects[0] : 'General',
        docStatus: t.verificationStatus,
        appliedAt: t.user.createdAt
      })),
      recentBookings: recentBookings.map(b => ({
        id: b.id,
        studentId: b.studentId,
        student: b.student.user.name,
        tutorId: b.tutorId,
        tutor: b.tutor.user.name,
        amount: `₹${((b.duration / 60) * b.tutor.hourlyRate).toFixed(0)}`,
        status: b.status,
        date: b.scheduledAt
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

  async createCourse(data: { title: string; subject: string; class: string; board: string; description?: string; instructorId: string }) {
    const tutorId = data.instructorId || (await this.prisma.tutorProfile.findFirst({ where: { isVerified: true } }))?.id;
    
    if (!tutorId) {
       throw new Error("No verified tutor available to assign to this course.");
    }

    return this.prisma.course.create({
      data: {
        title: data.title,
        subject: data.subject,
        class: data.class || "General",
        board: data.board || "General",
        description: data.description,
        createdBy: tutorId,
        isPublished: true,
      }
    });
  }

  async updateCourse(id: string, data: { title?: string; subject?: string; class?: string; board?: string; description?: string }) {
    return this.prisma.course.update({
      where: { id },
      data
    });
  }

  async deleteCourse(id: string) {
    return this.prisma.course.delete({
      where: { id }
    });
  }

  async getCourseById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });
  }

  async createChapter(courseId: string, data: { title: string; order: number }) {
    return this.prisma.chapter.create({
      data: {
        courseId,
        title: data.title,
        order: data.order
      }
    });
  }

  async updateChapter(id: string, data: { title?: string; order?: number }) {
    return this.prisma.chapter.update({
      where: { id },
      data
    });
  }

  async deleteChapter(id: string) {
    return this.prisma.chapter.delete({
      where: { id }
    });
  }

  async createLesson(chapterId: string, data: { title: string; videoUrl?: string; notesUrl?: string; duration: number; order: number }) {
    return this.prisma.lesson.create({
      data: {
        chapterId,
        title: data.title,
        videoUrl: data.videoUrl,
        notesUrl: data.notesUrl,
        duration: data.duration,
        order: data.order
      }
    });
  }

  async updateLesson(id: string, data: { title?: string; videoUrl?: string; notesUrl?: string; duration?: number; order?: number }) {
    return this.prisma.lesson.update({
      where: { id },
      data
    });
  }

  async deleteLesson(id: string) {
    return this.prisma.lesson.delete({
      where: { id }
    });
  }

  async getStudents() {
    return this.prisma.studentProfile.findMany({
      include: {
        user: { select: { name: true, email: true, status: true, createdAt: true } },
        parent: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        assignedTutor: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { joiningDate: 'desc' }
    });
  }

  async getParents() {
    return this.prisma.parentProfile.findMany({
      include: {
        user: { select: { name: true, email: true, status: true, createdAt: true } },
        children: { include: { user: { select: { name: true } } } }
      },
      orderBy: { user: { createdAt: 'desc' } }
    });
  }

  async getTutors() {
    return this.prisma.tutorProfile.findMany({
      include: {
        user: { select: { name: true, email: true, status: true, createdAt: true } },
        studentsAssigned: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { user: { createdAt: 'desc' } }
    });
  }

  async getCourses() {
    return this.prisma.course.findMany({
      include: {
        chapters: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getFees() {
    return this.prisma.fee.findMany({
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        payments: true
      },
      orderBy: { dueDate: 'desc' }
    });
  }

  async getAnalytics() {
    return this.prisma.dailyStat.findMany({
      orderBy: { date: 'desc' },
      take: 30
    });
  }

  async getNotifications() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { name: true, role: true } } }
    });
  }

  async getSettings() {
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read settings', e);
    }
    
    return {
      platformFeePercentage: 15,
      allowNewRegistrations: true,
      maintenanceMode: false,
      contactEmail: 'support@edtech.com'
    };
  }

  async updateSettings(data: any) {
    const currentSettings = await this.getSettings();
    const newSettings = { ...currentSettings, ...data };
    
    try {
      const dir = path.dirname(SETTINGS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));
      return newSettings;
    } catch (e) {
      console.error('Failed to save settings', e);
      throw new Error('Failed to save settings');
    }
  }

  async updateStudentStatus(id: string, status: string) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { id }, include: { user: true } });
    if (!profile) throw new Error("Student not found");
    return this.prisma.user.update({
      where: { id: profile.userId },
      data: { status }
    });
  }

  async updateCourseStatus(id: string, isPublished: boolean) {
    return this.prisma.course.update({
      where: { id },
      data: { isPublished }
    });
  }

  async sendNotification(data: { title: string, message: string, type: string, targetRole: 'ALL' | 'STUDENT' | 'TUTOR' }, adminId: string) {
    let users: { id: string }[] = [];
    if (data.targetRole === 'ALL') {
      users = await this.prisma.user.findMany({ select: { id: true } });
    } else {
      // Need to map frontend targetRole to backend Role enum
      // For simplicity, we just use the string and query
      users = await this.prisma.user.findMany({
        where: { role: data.targetRole as any },
        select: { id: true }
      });
    }

    if (users.length === 0) return { success: true, count: 0 };

    const notifications = users.map(u => ({
      userId: u.id,
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: false
    }));

    await this.prisma.notification.createMany({
      data: notifications
    });

    return { success: true, count: notifications.length };
  }
}
