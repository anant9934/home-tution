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
exports.ParentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ParentsService = class ParentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getParentWithChildren(userId) {
        const parent = await this.prisma.parentProfile.findUnique({
            where: { userId },
            include: {
                user: true,
                children: {
                    include: { user: true },
                },
            },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Parent profile not found');
        }
        return parent;
    }
    async resolveChild(userId, childId) {
        const parent = await this.getParentWithChildren(userId);
        if (parent.children.length === 0) {
            throw new common_1.NotFoundException('No children linked to this parent');
        }
        if (childId) {
            const child = parent.children.find((c) => c.id === childId);
            if (!child)
                throw new common_1.ForbiddenException('This child is not linked to your account');
            return child;
        }
        return parent.children[0];
    }
    async getDashboard(userId) {
        const parent = await this.getParentWithChildren(userId);
        if (parent.children.length === 0) {
            return {
                childName: 'No child linked',
                children: [],
                stats: { attendance: '0%', overallGrade: 'N/A', pendingFees: '₹0', teacherNotesCount: 0 },
                performance: [],
                homework: [],
                feedback: [],
                upcomingClasses: [],
            };
        }
        const child = parent.children[0];
        const attendanceRecords = await this.prisma.attendance.findMany({
            where: { studentId: child.id },
        });
        const presentCount = attendanceRecords.filter((a) => a.status === 'PRESENT').length;
        const totalDays = attendanceRecords.length || 1;
        const attendancePercentage = Math.round((presentCount / totalDays) * 100);
        const pendingFees = await this.prisma.fee.findMany({
            where: { studentId: child.id, status: 'PENDING' },
        });
        const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);
        const unreadMessages = await this.prisma.message.count({
            where: { conversation: { messages: { some: { senderId: { not: userId } } } }, seen: false },
        });
        const quizAttempts = await this.prisma.quizAttempt.findMany({
            where: { studentId: child.id },
            include: { quiz: { include: { course: true } } },
            orderBy: { startedAt: 'desc' },
            take: 20,
        });
        const subjectScores = {};
        for (const attempt of quizAttempts) {
            const subject = attempt.quiz.course?.subject || 'General';
            if (!subjectScores[subject])
                subjectScores[subject] = { total: 0, max: 0, count: 0 };
            subjectScores[subject].total += attempt.score;
            subjectScores[subject].max += attempt.quiz.totalMarks;
            subjectScores[subject].count++;
        }
        const performance = Object.entries(subjectScores).map(([subject, data]) => {
            const score = Math.round((data.total / data.max) * 100);
            return {
                title: subject,
                score,
                color: score >= 85 ? 'success' : score >= 65 ? 'primary' : 'warning',
            };
        });
        const avgScore = performance.length > 0
            ? Math.round(performance.reduce((s, p) => s + p.score, 0) / performance.length)
            : 0;
        const overallGrade = avgScore >= 90 ? 'A+' : avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B+' : avgScore >= 60 ? 'B' : avgScore >= 50 ? 'C' : 'D';
        const submissions = await this.prisma.submission.findMany({
            where: { studentId: child.id },
            include: { assignment: { include: { course: true } } },
            orderBy: { submittedAt: 'desc' },
            take: 5,
        });
        const pendingAssignments = await this.prisma.assignment.findMany({
            where: {
                deadline: { gte: new Date() },
                submissions: { none: { studentId: child.id } },
                course: { class: child.class },
            },
            include: { course: true },
            take: 3,
        });
        const homework = [
            ...submissions.map((s) => ({
                title: s.assignment.title,
                subject: s.assignment.course?.subject || 'General',
                status: 'Submitted',
                isWarning: false,
                marks: s.marks,
                maxMarks: s.assignment.maxMarks,
            })),
            ...pendingAssignments.map((a) => ({
                title: a.title,
                subject: a.course?.subject || 'General',
                status: 'Pending',
                isWarning: true,
                marks: null,
                maxMarks: a.maxMarks,
            })),
        ].slice(0, 5);
        const recentBookings = await this.prisma.booking.findMany({
            where: { studentId: child.id, status: 'COMPLETED' },
            include: { tutor: { include: { user: true } } },
            orderBy: { scheduledAt: 'desc' },
            take: 3,
        });
        const feedback = recentBookings.map((b) => ({
            tutorName: b.tutor.user.name,
            subject: b.tutor.subjects?.[0] || 'Tutor',
            date: b.scheduledAt.toISOString(),
            note: `${child.user.name.split(' ')[0]} has been performing well in recent sessions. Keep up the consistent effort!`,
        }));
        const upcomingBookings = await this.prisma.booking.findMany({
            where: {
                studentId: child.id,
                status: { in: ['PENDING', 'CONFIRMED'] },
                scheduledAt: { gte: new Date() },
            },
            include: { tutor: { include: { user: true } } },
            orderBy: { scheduledAt: 'asc' },
            take: 3,
        });
        const upcomingClasses = upcomingBookings.map((b) => ({
            id: b.id,
            title: `${b.bookingType === 'ONE_ON_ONE' ? '1-on-1' : 'Group'} ${b.tutor.subjects?.[0] || ''} Session`,
            time: b.scheduledAt.toISOString(),
            tutor: b.tutor.user.name,
            meetingLink: b.meetingLink,
        }));
        return {
            childName: child.user.name,
            children: parent.children.map((c) => ({ id: c.id, name: c.user.name, class: c.class, board: c.board })),
            stats: {
                attendance: `${attendancePercentage}%`,
                overallGrade,
                pendingFees: `₹${totalPending.toLocaleString('en-IN')}`,
                teacherNotesCount: unreadMessages,
            },
            performance,
            homework,
            feedback,
            upcomingClasses,
        };
    }
    async getChildren(userId) {
        const parent = await this.getParentWithChildren(userId);
        return parent.children.map((c) => ({
            id: c.id,
            name: c.user.name,
            email: c.user.email,
            class: c.class,
            board: c.board,
            schoolName: c.schoolName,
            avatarUrl: c.user.avatarUrl,
        }));
    }
    async getAttendance(userId, childId) {
        const child = await this.resolveChild(userId, childId);
        const records = await this.prisma.attendance.findMany({
            where: { studentId: child.id },
            include: {
                session: {
                    include: { booking: { include: { tutor: { include: { user: true } } } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const total = records.length;
        const present = records.filter((r) => r.status === 'PRESENT').length;
        const absent = records.filter((r) => r.status === 'ABSENT').length;
        const late = records.filter((r) => r.status === 'LATE').length;
        return {
            childName: child.user.name,
            summary: {
                total,
                present,
                absent,
                late,
                percentage: total > 0 ? Math.round((present / total) * 100) : 0,
            },
            records: records.map((r) => ({
                id: r.id,
                date: r.createdAt.toISOString(),
                status: r.status,
                tutor: r.session?.booking?.tutor?.user?.name || 'Unknown',
                subject: r.session?.booking?.tutor?.subjects?.[0] || 'General',
            })),
        };
    }
    async getFees(userId, childId) {
        const child = await this.resolveChild(userId, childId);
        const fees = await this.prisma.fee.findMany({
            where: { studentId: child.id },
            include: { payments: true },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        const totalPending = fees.filter((f) => f.status === 'PENDING').reduce((s, f) => s + f.amount, 0);
        const totalPaid = fees.filter((f) => f.status === 'PAID').reduce((s, f) => s + f.amount, 0);
        return {
            childName: child.user.name,
            summary: {
                totalPending: `₹${totalPending.toLocaleString('en-IN')}`,
                totalPaid: `₹${totalPaid.toLocaleString('en-IN')}`,
                pendingCount: fees.filter((f) => f.status === 'PENDING').length,
            },
            fees: fees.map((f) => ({
                id: f.id,
                month: f.month,
                year: f.year,
                amount: f.amount,
                dueDate: f.dueDate.toISOString(),
                status: f.status,
                payment: f.payments[0]
                    ? {
                        transactionId: f.payments[0].transactionId,
                        paidAt: f.payments[0].paidAt.toISOString(),
                        gateway: f.payments[0].paymentGateway,
                    }
                    : null,
            })),
        };
    }
    async payFee(userId, feeId) {
        const parent = await this.getParentWithChildren(userId);
        const childIds = parent.children.map((c) => c.id);
        const fee = await this.prisma.fee.findUnique({ where: { id: feeId } });
        if (!fee)
            throw new common_1.NotFoundException('Fee not found');
        if (!childIds.includes(fee.studentId))
            throw new common_1.ForbiddenException('This fee does not belong to your child');
        if (fee.status === 'PAID')
            return { message: 'Fee already paid', fee };
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        await this.prisma.payment.create({
            data: {
                feeId: fee.id,
                paymentGateway: 'RAZORPAY',
                transactionId,
                amount: fee.amount,
                status: 'SUCCESS',
            },
        });
        const updatedFee = await this.prisma.fee.update({
            where: { id: feeId },
            data: { status: 'PAID' },
            include: { payments: true },
        });
        return {
            message: 'Payment successful',
            transactionId,
            fee: {
                id: updatedFee.id,
                amount: updatedFee.amount,
                status: updatedFee.status,
                month: updatedFee.month,
                year: updatedFee.year,
            },
        };
    }
    async getPerformance(userId, childId) {
        const child = await this.resolveChild(userId, childId);
        const quizAttempts = await this.prisma.quizAttempt.findMany({
            where: { studentId: child.id },
            include: { quiz: { include: { course: true } } },
            orderBy: { startedAt: 'desc' },
        });
        const submissions = await this.prisma.submission.findMany({
            where: { studentId: child.id },
            include: { assignment: { include: { course: true } } },
            orderBy: { submittedAt: 'desc' },
        });
        const xp = await this.prisma.xP.findMany({ where: { studentId: child.id } });
        const totalXP = xp.reduce((s, x) => s + x.points, 0);
        const badges = await this.prisma.studentBadge.findMany({
            where: { studentId: child.id },
            include: { badge: true },
        });
        const subjectScores = {};
        for (const attempt of quizAttempts) {
            const subject = attempt.quiz.course?.subject || 'General';
            if (!subjectScores[subject])
                subjectScores[subject] = { scores: [], maxScores: [] };
            subjectScores[subject].scores.push(attempt.score);
            subjectScores[subject].maxScores.push(attempt.quiz.totalMarks);
        }
        const subjectPerformance = Object.entries(subjectScores).map(([subject, data]) => {
            const totalScore = data.scores.reduce((a, b) => a + b, 0);
            const totalMax = data.maxScores.reduce((a, b) => a + b, 0);
            const percentage = Math.round((totalScore / totalMax) * 100);
            return {
                subject,
                percentage,
                quizzesTaken: data.scores.length,
                color: percentage >= 85 ? 'success' : percentage >= 65 ? 'primary' : 'warning',
            };
        });
        return {
            childName: child.user.name,
            totalXP,
            badges: badges.map((b) => ({ name: b.badge.name, icon: b.badge.icon, earnedAt: b.earnedAt.toISOString() })),
            subjectPerformance,
            quizHistory: quizAttempts.slice(0, 10).map((a) => ({
                id: a.id,
                quizTitle: a.quiz.title,
                subject: a.quiz.course?.subject || 'General',
                score: a.score,
                totalMarks: a.quiz.totalMarks,
                percentage: Math.round((a.score / a.quiz.totalMarks) * 100),
                date: a.startedAt.toISOString(),
                timeTaken: a.timeTaken,
            })),
            assignmentHistory: submissions.slice(0, 10).map((s) => ({
                id: s.id,
                title: s.assignment.title,
                subject: s.assignment.course?.subject || 'General',
                marks: s.marks,
                maxMarks: s.assignment.maxMarks,
                percentage: s.marks != null ? Math.round((s.marks / s.assignment.maxMarks) * 100) : null,
                feedback: s.feedback,
                date: s.submittedAt.toISOString(),
            })),
        };
    }
    async getMessages(userId) {
        const conversations = await this.prisma.conversation.findMany({
            where: { messages: { some: { senderId: userId } } },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { id: true, name: true, role: true, avatarUrl: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return conversations.map((conv) => {
            const otherUser = conv.messages.find((m) => m.senderId !== userId)?.sender;
            const lastMessage = conv.messages[conv.messages.length - 1];
            const unreadCount = conv.messages.filter((m) => m.senderId !== userId && !m.seen).length;
            return {
                id: conv.id,
                otherUser: otherUser ? { id: otherUser.id, name: otherUser.name, role: otherUser.role, avatarUrl: otherUser.avatarUrl } : null,
                lastMessage: lastMessage ? { text: lastMessage.messageText, date: lastMessage.createdAt.toISOString(), isOwn: lastMessage.senderId === userId } : null,
                unreadCount,
                messages: conv.messages.map((m) => ({
                    id: m.id,
                    text: m.messageText,
                    senderId: m.senderId,
                    senderName: m.sender.name,
                    isOwn: m.senderId === userId,
                    seen: m.seen,
                    date: m.createdAt.toISOString(),
                })),
            };
        });
    }
    async sendMessage(userId, dto) {
        let conversation = await this.prisma.conversation.findFirst({
            where: {
                AND: [
                    { messages: { some: { senderId: userId } } },
                    { messages: { some: { senderId: dto.tutorUserId } } },
                ],
            },
        });
        if (!conversation) {
            conversation = await this.prisma.conversation.create({
                data: { type: 'DIRECT' },
            });
        }
        const message = await this.prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: userId,
                messageText: dto.messageText,
                seen: false,
            },
            include: { sender: { select: { id: true, name: true } } },
        });
        return {
            id: message.id,
            conversationId: conversation.id,
            text: message.messageText,
            senderName: message.sender.name,
            date: message.createdAt.toISOString(),
        };
    }
    async getProfile(userId) {
        const parent = await this.getParentWithChildren(userId);
        return {
            id: parent.id,
            name: parent.user.name,
            email: parent.user.email,
            phone: parent.user.phone,
            avatarUrl: parent.user.avatarUrl,
            occupation: parent.occupation,
            address: parent.address,
            children: parent.children.map((c) => ({
                id: c.id,
                name: c.user.name,
                class: c.class,
                board: c.board,
                schoolName: c.schoolName,
            })),
        };
    }
    async updateProfile(userId, dto) {
        const parent = await this.prisma.parentProfile.findUnique({ where: { userId } });
        if (!parent)
            throw new common_1.NotFoundException('Parent profile not found');
        if (dto.occupation !== undefined || dto.address !== undefined) {
            await this.prisma.parentProfile.update({
                where: { userId },
                data: {
                    ...(dto.occupation !== undefined && { occupation: dto.occupation }),
                    ...(dto.address !== undefined && { address: dto.address }),
                },
            });
        }
        if (dto.name !== undefined || dto.phone !== undefined) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    ...(dto.name !== undefined && { name: dto.name }),
                    ...(dto.phone !== undefined && { phone: dto.phone }),
                },
            });
        }
        return this.getProfile(userId);
    }
};
exports.ParentsService = ParentsService;
exports.ParentsService = ParentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParentsService);
//# sourceMappingURL=parents.service.js.map