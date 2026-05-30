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
    async getDashboard(userId) {
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
            throw new common_1.NotFoundException('Student profile not found');
        }
        const leaderboard = [
            { rank: 1, name: 'Priya Sharma', xp: 1200 },
            { rank: 2, name: 'Rahul Verma', xp: 1150 },
            { rank: 3, name: 'You', xp: 1100, isCurrent: true },
            { rank: 4, name: 'Aarav Patel', xp: 1050 },
            { rank: 5, name: 'Neha Gupta', xp: 950 },
        ];
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
        const pendingTasks = [
            {
                id: '1',
                title: 'Calculus Worksheet #4',
                type: 'Assignment',
                dueAt: new Date(new Date().setHours(23, 59, 59, 999)),
                status: 'Pending'
            }
        ];
        const currentStreak = student.attendance.length > 0 ? 4 : 0;
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
    create(createStudentDto) {
        return 'This action adds a new student';
    }
    findAll() {
        return `This action returns all students`;
    }
    findOne(id) {
        return `This action returns a #${id} student`;
    }
    update(id, updateStudentDto) {
        return `This action updates a #${id} student`;
    }
    remove(id) {
        return `This action removes a #${id} student`;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map