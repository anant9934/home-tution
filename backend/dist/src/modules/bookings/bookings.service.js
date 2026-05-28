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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBooking(studentUserId, dto) {
        const studentProfile = await this.prisma.studentProfile.findUnique({
            where: { userId: studentUserId },
        });
        if (!studentProfile) {
            throw new common_1.ForbiddenException('Only students can create bookings');
        }
        const tutorProfile = await this.prisma.tutorProfile.findUnique({
            where: { id: dto.tutorId },
        });
        if (!tutorProfile) {
            throw new common_1.NotFoundException('Tutor not found');
        }
        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                tutorId: dto.tutorId,
                scheduledAt: new Date(dto.scheduledAt),
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
        });
        if (existingBooking) {
            throw new common_1.BadRequestException('Tutor already has a booking at this time');
        }
        const booking = await this.prisma.booking.create({
            data: {
                studentId: studentProfile.id,
                tutorId: dto.tutorId,
                bookingType: dto.bookingType,
                scheduledAt: new Date(dto.scheduledAt),
                duration: dto.duration,
                meetingLink: dto.meetingLink,
                status: 'PENDING',
            },
        });
        return this.getBookingById(booking.id);
    }
    async getStudentBookings(studentUserId, status) {
        const studentProfile = await this.prisma.studentProfile.findUnique({
            where: { userId: studentUserId },
        });
        if (!studentProfile)
            throw new common_1.ForbiddenException('Student profile not found');
        return this.prisma.booking.findMany({
            where: {
                studentId: studentProfile.id,
                ...(status && { status: status }),
            },
            include: {
                tutor: {
                    include: {
                        user: { select: { name: true, avatarUrl: true, email: true } },
                    },
                },
                classSession: true,
            },
            orderBy: { scheduledAt: 'desc' },
        });
    }
    async getTutorBookings(tutorUserId, status) {
        const tutorProfile = await this.prisma.tutorProfile.findUnique({
            where: { userId: tutorUserId },
        });
        if (!tutorProfile)
            throw new common_1.ForbiddenException('Tutor profile not found');
        return this.prisma.booking.findMany({
            where: {
                tutorId: tutorProfile.id,
                ...(status && { status: status }),
            },
            include: {
                student: {
                    include: {
                        user: { select: { name: true, avatarUrl: true, email: true, phone: true } },
                    },
                },
                classSession: true,
            },
            orderBy: { scheduledAt: 'desc' },
        });
    }
    async getBookingById(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                student: { include: { user: { select: { name: true, email: true, phone: true } } } },
                tutor: { include: { user: { select: { name: true, email: true } } } },
                classSession: true,
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async updateBookingStatus(id, tutorUserId, dto) {
        const booking = await this.getBookingById(id);
        const tutorProfile = await this.prisma.tutorProfile.findUnique({
            where: { userId: tutorUserId },
        });
        if (!tutorProfile || booking.tutorId !== tutorProfile.id) {
            throw new common_1.ForbiddenException('You can only update your own bookings');
        }
        return this.prisma.booking.update({
            where: { id },
            data: {
                status: dto.status,
                ...(dto.meetingLink && { meetingLink: dto.meetingLink }),
            },
        });
    }
    async cancelBooking(id, studentUserId) {
        const booking = await this.getBookingById(id);
        const studentProfile = await this.prisma.studentProfile.findUnique({
            where: { userId: studentUserId },
        });
        if (!studentProfile || booking.studentId !== studentProfile.id) {
            throw new common_1.ForbiddenException('You can only cancel your own bookings');
        }
        if (booking.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot cancel a completed booking');
        }
        return this.prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
    async startSession(bookingId, tutorUserId) {
        const booking = await this.getBookingById(bookingId);
        const tutorProfile = await this.prisma.tutorProfile.findUnique({
            where: { userId: tutorUserId },
        });
        if (!tutorProfile || booking.tutorId !== tutorProfile.id) {
            throw new common_1.ForbiddenException('Only the assigned tutor can start the session');
        }
        if (booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Booking must be confirmed before starting');
        }
        return this.prisma.classSession.upsert({
            where: { bookingId },
            create: { bookingId, startedAt: new Date() },
            update: { startedAt: new Date() },
        });
    }
    async endSession(bookingId, tutorUserId, recordingUrl) {
        const booking = await this.getBookingById(bookingId);
        const tutorProfile = await this.prisma.tutorProfile.findUnique({
            where: { userId: tutorUserId },
        });
        if (!tutorProfile || booking.tutorId !== tutorProfile.id) {
            throw new common_1.ForbiddenException('Only the assigned tutor can end the session');
        }
        const session = await this.prisma.classSession.update({
            where: { bookingId },
            data: {
                endedAt: new Date(),
                attendanceStatus: 'COMPLETED',
                ...(recordingUrl && { recordingUrl }),
            },
        });
        await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'COMPLETED' },
        });
        return session;
    }
    async getAllBookings(status, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const bookings = await this.prisma.booking.findMany({
            where: { ...(status && { status: status }) },
            include: {
                student: { include: { user: { select: { name: true } } } },
                tutor: { include: { user: { select: { name: true } } } },
            },
            orderBy: { scheduledAt: 'desc' },
            skip,
            take: limit,
        });
        const total = await this.prisma.booking.count({
            where: { ...(status && { status: status }) },
        });
        return { data: bookings, total, page, limit };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map