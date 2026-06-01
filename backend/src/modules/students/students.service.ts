import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getStudentId(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });
    if (!student) throw new NotFoundException('Student profile not found');
    return student.id;
  }

  // ─── DASHBOARD ──────────────────────────────────────────────────────────
  async getDashboard(userId: string) {
    const studentId = await this.getStudentId(userId);
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        xp: true,
        badges: {
          include: { badge: true },
          orderBy: { earnedAt: 'desc' },
          take: 3,
        },
        attendance: {
          take: 7,
          orderBy: { createdAt: 'desc' }
        },
        bookings: {
          where: { scheduledAt: { gte: new Date() } },
          orderBy: { scheduledAt: 'asc' },
          take: 3,
          include: { tutor: { include: { user: true } } }
        }
      }
    });

    if (!student) throw new NotFoundException('Student profile not found');

    // 1. Calculate XP
    const totalXP = student.xp.reduce((sum, item) => sum + item.points, 0);

    // 2. Streak
    const currentStreak = student.attendance.length; // Simplified streak calculation

    // 3. Courses (Matching class and board)
    const courses = await this.prisma.course.findMany({
      where: { class: student.class, board: student.board },
      include: {
        chapters: { include: { lessons: { include: { progress: { where: { studentId } } } } } },
        quizzes: {
          include: { attempts: { where: { studentId } } }
        },
        assignments: {
          include: { submissions: { where: { studentId } } }
        }
      },
      take: 2,
    });

    const enrolledCourses = courses.map(c => {
      let completedLessons = 0;
      let totalLessons = 0;
      c.chapters.forEach(ch => {
        totalLessons += ch.lessons.length;
        completedLessons += ch.lessons.filter(l => l.progress.length > 0 && l.progress[0].completed).length;
      });

      const totalTasks = c.quizzes.length + totalLessons;
      const completedTasks = 
        c.quizzes.filter(q => q.attempts.length > 0).length + 
        completedLessons;
      
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return {
        id: c.id,
        title: c.title,
        instructor: 'Platform Admin',
        progress,
        nextLesson: c.chapters[0]?.lessons[0]?.title || 'Introduction'
      };
    });

    // 4. Pending Tasks
    const allAssignments = await this.prisma.assignment.findMany({
      where: { 
        course: { class: student.class, board: student.board },
        submissions: { none: { studentId } }
      },
      include: { course: true },
      take: 2,
    });

    const allQuizzes = await this.prisma.quiz.findMany({
      where: { 
        course: { class: student.class, board: student.board },
        attempts: { none: { studentId } }
      },
      include: { course: true },
      take: 2,
    });

    const pendingTasks = [
      ...allAssignments.map(a => ({
        id: a.id,
        title: a.title,
        type: 'Assignment',
        subject: a.course.subject,
        due: a.deadline.toISOString().split('T')[0]
      })),
      ...allQuizzes.map(q => ({
        id: q.id,
        title: q.title,
        type: 'Quiz',
        subject: q.course.subject,
        due: 'No Deadline'
      }))
    ];

    return {
      studentName: student.user.name,
      xp: totalXP,
      streak: currentStreak,
      enrolledCourses,
      pendingTasks,
      upcomingClasses: student.bookings.map(b => ({
        id: b.id,
        title: b.bookingType === 'ONE_ON_ONE' ? '1-on-1 Class' : 'Group Batch',
        time: b.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tutor: b.tutor.user.name,
        meetingLink: b.meetingLink
      })),
      recentAchievements: student.badges.map(b => b.badge.name)
    };
  }

  // ─── COURSES ────────────────────────────────────────────────────────────
  async getCourses(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException();

    const courses = await this.prisma.course.findMany({
      where: { class: student.class, board: student.board },
      include: {
        chapters: { include: { lessons: { include: { progress: { where: { studentId: student.id } } } } } },
        quizzes: { include: { attempts: { where: { studentId: student.id } } } },
        assignments: { include: { submissions: { where: { studentId: student.id } } } }
      }
    });

    return courses.map(c => {
      let completedLessons = 0;
      let totalLessons = 0;
      c.chapters.forEach(ch => {
        totalLessons += ch.lessons.length;
        completedLessons += ch.lessons.filter(l => l.progress.length > 0 && l.progress[0].completed).length;
      });

      const totalTasks = c.quizzes.length + totalLessons;
      const completedTasks = c.quizzes.filter(q => q.attempts.length > 0).length + completedLessons;
      
      return {
        id: c.id,
        title: c.title,
        subject: c.subject,
        description: c.description || 'Comprehensive course material',
        instructor: 'Platform Admin',
        progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        chapters: c.chapters.map(ch => ({
          title: ch.title,
          lessons: ch.lessons.map(l => l.title)
        }))
      };
    });
  }

  async getCourseCurriculum(userId: string, courseId: string) {
    const studentId = await this.getStudentId(userId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: { progress: { where: { studentId } } }
            }
          }
        },
        quizzes: {
          include: { attempts: { where: { studentId } } }
        }
      }
    });

    if (!course) throw new NotFoundException('Course not found');

    let globalId = 1;
    const curriculum: any[] = [];

    // Map chapters and lessons
    course.chapters.forEach(chapter => {
       chapter.lessons.forEach(lesson => {
         curriculum.push({
           id: globalId++,
           lessonId: lesson.id,
           title: lesson.title,
           type: 'video',
           duration: `${lesson.duration} mins`,
           videoUrl: lesson.videoUrl,
           completed: lesson.progress.length > 0 && lesson.progress[0].completed,
         });
       });
    });

    // Append quizzes at the end (simplification for mock)
    course.quizzes.forEach(quiz => {
       curriculum.push({
          id: globalId++,
          quizId: quiz.id,
          title: quiz.title,
          type: 'quiz',
          duration: `${quiz.duration} mins`,
          completed: quiz.attempts.length > 0,
       });
    });

    return { courseTitle: course.title, curriculum };
  }

  async markLessonComplete(userId: string, lessonId: string) {
    const studentId = await this.getStudentId(userId);
    
    const progress = await this.prisma.lessonProgress.upsert({
      where: { studentId_lessonId: { studentId, lessonId } },
      update: { completed: true },
      create: { studentId, lessonId, completed: true }
    });

    // Optionally award XP for completing a video
    await this.prisma.xP.create({
      data: {
        studentId,
        points: 10,
        source: 'LESSON',
      }
    });

    return { success: true, progress };
  }

  // ─── ATTENDANCE ─────────────────────────────────────────────────────────
  async getAttendance(userId: string) {
    const studentId = await this.getStudentId(userId);
    const records = await this.prisma.attendance.findMany({
      where: { studentId },
      include: { session: { include: { booking: { include: { tutor: { include: { user: true } } } } } } },
      orderBy: { createdAt: 'desc' }
    });

    const presentDays = records.filter(r => r.status === 'PRESENT').length;
    const absentDays = records.filter(r => r.status === 'ABSENT').length;
    const totalDays = records.length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return {
      stats: { presentDays, absentDays, totalDays, percentage },
      records: records.map(r => ({
        id: r.id,
        date: r.createdAt.toISOString().split('T')[0],
        subject: r.session.booking.bookingType, // Approximation since booking has no subject
        status: r.status,
        teacher: r.session.booking.tutor.user.name,
      }))
    };
  }

  // ─── ASSIGNMENTS ────────────────────────────────────────────────────────
  async getAssignments(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException();

    const pending = await this.prisma.assignment.findMany({
      where: { 
        course: { class: student.class, board: student.board },
        submissions: { none: { studentId: student.id } }
      },
      include: { course: true },
      orderBy: { deadline: 'asc' }
    });

    const submitted = await this.prisma.submission.findMany({
      where: { studentId: student.id },
      include: { assignment: { include: { course: true } } },
      orderBy: { submittedAt: 'desc' }
    });

    return {
      pending: pending.map(a => ({
        id: a.id,
        title: a.title,
        subject: a.course.subject,
        dueDate: a.deadline.toISOString().split('T')[0],
        marks: a.maxMarks
      })),
      submitted: submitted.map(s => ({
        id: s.id,
        title: s.assignment.title,
        subject: s.assignment.course.subject,
        submittedAt: s.submittedAt.toISOString().split('T')[0],
        score: s.marks ? `${s.marks}/${s.assignment.maxMarks}` : 'Pending Grading',
        status: s.marks ? 'Graded' : 'Submitted'
      }))
    };
  }

  async submitAssignment(userId: string, assignmentId: string, submissionUrl: string) {
    const studentId = await this.getStudentId(userId);
    
    const assignment = await this.prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const submission = await this.prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        submissionUrl: submissionUrl || 'https://example.com/mock-submission.pdf',
        submittedAt: new Date()
      }
    });

    // Award XP for submitting assignment
    await this.prisma.xP.create({
      data: {
        studentId,
        points: 50, // Standard XP for assignment
        source: 'ASSIGNMENT',
      }
    });

    return { success: true, submission };
  }

  // ─── QUIZZES ────────────────────────────────────────────────────────────
  async getQuizzes(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException();

    const pending = await this.prisma.quiz.findMany({
      where: { 
        course: { class: student.class, board: student.board },
        attempts: { none: { studentId: student.id } }
      },
      include: { course: true, questions: true },
    });

    const completed = await this.prisma.quizAttempt.findMany({
      where: { studentId: student.id },
      include: { quiz: { include: { course: true } } },
      orderBy: { submittedAt: 'desc' }
    });

    return {
      pending: pending.map(q => ({
        id: q.id,
        title: q.title,
        subject: q.course.subject,
        duration: q.duration,
        questions: q.questions.map(qst => ({
          id: qst.id,
          text: qst.questionText,
          options: qst.options as string[],
          // SECURITY: Exclude correctAnswer so students cannot inspect the network tab to cheat.
        }))
      })),
      completed: completed.map(c => ({
        id: c.id,
        title: c.quiz.title,
        subject: c.quiz.course.subject,
        score: `${c.score}/${c.quiz.totalMarks}`,
        date: c.submittedAt?.toISOString().split('T')[0] || c.startedAt.toISOString().split('T')[0]
      }))
    };
  }

  async submitQuiz(userId: string, quizId: string, payload: { answers?: Record<string, string>, score?: number }) {
    const studentId = await this.getStudentId(userId);
    
    const quiz = await this.prisma.quiz.findUnique({ 
      where: { id: quizId },
      include: { questions: true } 
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    // Secure Score Calculation
    let calculatedScore = payload.score || 0;
    if (payload.answers) {
      calculatedScore = 0;
      quiz.questions.forEach(question => {
        const studentAnswer = payload.answers![question.id];
        if (studentAnswer === question.correctAnswer) {
          calculatedScore += question.marks;
        }
      });
    }

    // 1. Record Attempt
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        score: calculatedScore,
        submittedAt: new Date(),
      }
    });

    // 2. Award XP
    const xpReward = Math.round((calculatedScore / quiz.totalMarks) * 100);
    if (xpReward > 0) {
      await this.prisma.xP.create({
        data: {
          studentId,
          points: xpReward,
          source: 'QUIZ',
        }
      });
    }

    return { success: true, attempt, xpEarned: xpReward };
  }

  // ─── LEADERBOARD ────────────────────────────────────────────────────────
  async getLeaderboard(userId: string) {
    const studentId = await this.getStudentId(userId);

    // Get all students and calculate total XP dynamically
    const allStudents = await this.prisma.studentProfile.findMany({
      include: {
        user: true,
        xp: true,
        badges: true
      }
    });

    const leaderboard = allStudents.map(s => {
      const totalXP = s.xp.reduce((sum, item) => sum + item.points, 0);
      return {
        id: s.id,
        name: s.user.name,
        avatar: s.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${s.user.name}`,
        xp: totalXP,
        badges: s.badges.length,
        isCurrent: s.id === studentId
      };
    }).sort((a, b) => b.xp - a.xp).map((s, index) => ({ ...s, rank: index + 1 }));

    return leaderboard;
  }

  // ─── MESSAGES ───────────────────────────────────────────────────────────
  async getMessages(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: { participants: { some: { id: userId } } },
      include: {
        participants: {
          select: { id: true, name: true, role: true, avatarUrl: true }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true, role: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p.id !== userId) || conv.participants[0];
      return {
        id: conv.id,
        participant: otherParticipant,
        latestMessage: conv.messages[conv.messages.length - 1] || null,
        updatedAt: conv.messages[conv.messages.length - 1]?.createdAt || conv.createdAt
      };
    });
  }


  // ─── PROFILE ────────────────────────────────────────────────────────────
  async getProfile(userId: string) {
    const studentId = await this.getStudentId(userId);
    const profile = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: true }
    });

    if (!profile) throw new NotFoundException();

    return {
      id: profile.id,
      name: profile.user.name,
      email: profile.user.email,
      phone: profile.user.phone,
      class: profile.class,
      board: profile.board,
      school: profile.schoolName,
      joiningDate: profile.joiningDate.toISOString().split('T')[0]
    };
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; email?: string; phone?: string }) {
    const studentId = await this.getStudentId(userId);
    
    // Update User table details
    const name = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined;
    
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone })
      }
    });

    return this.getProfile(userId);
  }
}
