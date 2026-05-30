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
exports.TutorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TutorsService = class TutorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(userId) {
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
            throw new common_1.NotFoundException('Tutor profile not found');
        }
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const todayBookings = tutor.bookings.filter(b => b.scheduledAt >= todayStart && b.scheduledAt <= todayEnd);
        const uniqueStudents = new Set(tutor.bookings.map(b => b.studentId));
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const completedBookingsThisMonth = tutor.bookings.filter(b => b.status === 'COMPLETED' && b.scheduledAt >= startOfMonth);
        const monthlyEarnings = completedBookingsThisMonth.reduce((sum, b) => sum + (b.duration / 60) * tutor.hourlyRate, 0);
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
                monthlyEarnings: `₹${(monthlyEarnings / 1000).toFixed(1)}k`
            },
            schedule: todayBookings.map(b => ({
                id: b.id,
                title: `${b.bookingType === 'ONE_ON_ONE' ? '1-on-1 Tuition' : 'Group Batch'}`,
                type: b.bookingType === 'ONE_ON_ONE' ? '1-on-1 Tuition' : 'Group Batch',
                students: b.bookingType === 'ONE_ON_ONE' ? 1 : 24,
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
            subjects: ['Mathematics', 'Physics'],
            qualification: t.qualification,
            experience: `${t.experienceYears} years`,
            hourlyRate: `₹${t.hourlyRate}`,
            rating: 4.8,
            reviews: 124,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.user.name.replace(' ', '')}`,
            isVerified: t.verificationStatus === 'VERIFIED'
        }));
    }
    create(createTutorDto) {
        return 'This action adds a new tutor';
    }
    findAll() {
        return `This action returns all tutors`;
    }
    findOne(id) {
        return `This action returns a #${id} tutor`;
    }
    update(id, updateTutorDto) {
        return `This action updates a #${id} tutor`;
    }
    remove(id) {
        return `This action removes a #${id} tutor`;
    }
};
exports.TutorsService = TutorsService;
exports.TutorsService = TutorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TutorsService);
//# sourceMappingURL=tutors.service.js.map