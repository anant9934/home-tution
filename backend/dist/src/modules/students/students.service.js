"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStudentId(userId) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!student)
            throw new common_1.NotFoundException('Student profile not found');
        return student.id;
    }
    async getDashboard(userId) {
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
        if (!student)
            throw new common_1.NotFoundException('Student profile not found');
        const totalXP = student.xp.reduce((sum, item) => sum + item.points, 0);
        const currentStreak = student.attendance.length;
        const courses = await this.prisma.course.findMany({
            where: { class: student.class, board: student.board },
            include: {
                chapters: { include: { lessons: true } },
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
            const totalTasks = c.quizzes.length + c.assignments.length;
            const completedTasks = c.quizzes.filter(q => q.attempts.length > 0).length +
                c.assignments.filter(a => a.submissions.length > 0).length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            return {
                id: c.id,
                title: c.title,
                instructor: 'Platform Admin',
                progress,
                nextLesson: c.chapters[0]?.lessons[0]?.title || 'Introduction'
            };
        });
        const allAssignments = await this.prisma.assignment.findMany({
            where: {
                course: { class: student.class, board: student.board },
                submissions: { none: { studentId } }
            },
            include: { course: true },
            take: 2,
        });
        const pendingTasks = allAssignments.map(a => ({
            id: a.id,
            title: a.title,
            type: 'Assignment',
            subject: a.course.subject,
            due: a.deadline.toISOString().split('T')[0]
        }));
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
                tutor: b.tutor.user.name
            })),
            recentAchievements: student.badges.map(b => b.badge.name)
        };
    }
    async getCourses(userId) {
        const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
        if (!student)
            throw new common_1.NotFoundException();
        const courses = await this.prisma.course.findMany({
            where: { class: student.class, board: student.board },
            include: {
                chapters: { include: { lessons: true } },
                quizzes: { include: { attempts: { where: { studentId: student.id } } } },
                assignments: { include: { submissions: { where: { studentId: student.id } } } }
            }
        });
        return courses.map(c => {
            const totalTasks = c.quizzes.length + c.assignments.length;
            const completedTasks = c.quizzes.filter(q => q.attempts.length > 0).length + c.assignments.filter(a => a.submissions.length > 0).length;
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
    async getAttendance(userId) {
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
                subject: r.session.booking.bookingType,
                status: r.status,
                teacher: r.session.booking.tutor.user.name,
            }))
        };
    }
    async getAssignments(userId) {
        const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
        if (!student)
            throw new common_1.NotFoundException();
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
    async getQuizzes(userId) {
        const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
        if (!student)
            throw new common_1.NotFoundException();
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
                    options: qst.options,
                    correctAnswer: qst.correctAnswer
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
    async submitQuiz(userId, quizId, score) {
        const studentId = await this.getStudentId(userId);
        const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
        if (!quiz)
            throw new common_1.NotFoundException();
        const attempt = await this.prisma.quizAttempt.create({
            data: {
                quizId,
                studentId,
                score,
                submittedAt: new Date(),
            }
        });
        const xpReward = Math.round((score / quiz.totalMarks) * 100);
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
    async getLeaderboard(userId) {
        const studentId = await this.getStudentId(userId);
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
    async getMessages(userId) {
        return this.prisma.conversation.findMany({
            where: { messages: { some: { senderId: userId } } },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: true }
                }
            }
        });
    }
    async getProfile(userId) {
        const studentId = await this.getStudentId(userId);
        const profile = await this.prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: { user: true }
        });
        if (!profile)
            throw new common_1.NotFoundException();
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
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map