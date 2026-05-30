import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        bookings: {
          where: { scheduledAt: { gte: new Date() } },
          orderBy: { scheduledAt: 'asc' },
          take: 5,
          include: { tutor: { include: { user: true } } }
        },
        xp: true,
        attendance: {
          take: 7,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Mocking leaderboard since the query is complex, 
    // but in a real scenario we'd query the Leaderboard table
    const leaderboard = [
      { rank: 1, name: 'Priya Sharma', xp: 1200 },
      { rank: 2, name: 'Rahul Verma', xp: 1150 },
      { rank: 3, name: 'You', xp: 1100, isCurrent: true },
      { rank: 4, name: 'Aarav Patel', xp: 1050 },
      { rank: 5, name: 'Neha Gupta', xp: 950 },
    ];

    // Mocking active courses since CourseEnrollment model is not defined directly yet
    const activeCourses = [
      {
        id: '1',
        title: 'Kinematics: Projectile Motion',
        subject: 'Physics',
        progress: 65,
        totalParts: 8,
        completedParts: 5
      },
      {
        id: '2',
        title: 'Integration & Applications',
        subject: 'Mathematics',
        progress: 12,
        totalParts: 12,
        completedParts: 1
      }
    ];

    // Mocking pending tasks/assignments
    const pendingTasks = [
      {
        id: '1',
        title: 'Calculus Worksheet #4',
        type: 'Assignment',
        dueAt: new Date(new Date().setHours(23, 59, 59, 999)),
        status: 'Pending'
      }
    ];

    // Calculate streaks
    const currentStreak = student.attendance.length > 0 ? 4 : 0; // Simplified
    const weeklyGoal = 5;

    return {
      student: {
        id: student.id,
        class: student.class,
        board: student.board
      },
      stats: {
        currentStreak,
        weeklyGoal,
        totalXP: student.xp.reduce((sum, item) => sum + item.points, 0)
      },
      schedule: student.bookings.map(b => ({
        id: b.id,
        title: `${b.bookingType === 'ONE_ON_ONE' ? '1-on-1' : 'Live Class'}`,
        tutor: b.tutor.user.name,
        time: b.scheduledAt,
        status: b.status,
        type: b.bookingType
      })),
      leaderboard,
      activeCourses,
      pendingTasks
    };
  }

  create(createStudentDto: CreateStudentDto) {
    return 'This action adds a new student';
  }

  findAll() {
    return `This action returns all students`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
