import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CREATE BOOKING (Student books a Tutor) ───────────────────────────────

  async createBooking(studentUserId: string, dto: CreateBookingDto) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });
    if (!studentProfile) {
      throw new ForbiddenException('Only students can create bookings');
    }

    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { id: dto.tutorId },
    });
    if (!tutorProfile) {
      throw new NotFoundException('Tutor not found');
    }

    // Check scheduling conflicts
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        tutorId: dto.tutorId,
        scheduledAt: new Date(dto.scheduledAt),
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    if (existingBooking) {
      throw new BadRequestException('Tutor already has a booking at this time');
    }

    // Create booking (no include — avoids Neon HTTP transaction limitation)
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

  // ─── GET STUDENT'S BOOKINGS ───────────────────────────────────────────────

  async getStudentBookings(studentUserId: string, status?: string) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });
    if (!studentProfile) throw new ForbiddenException('Student profile not found');

    return this.prisma.booking.findMany({
      where: {
        studentId: studentProfile.id,
        ...(status && { status: status as any }),
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

  // ─── GET TUTOR'S BOOKINGS ─────────────────────────────────────────────────

  async getTutorBookings(tutorUserId: string, status?: string) {
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
    });
    if (!tutorProfile) throw new ForbiddenException('Tutor profile not found');

    return this.prisma.booking.findMany({
      where: {
        tutorId: tutorProfile.id,
        ...(status && { status: status as any }),
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

  // ─── GET BOOKING BY ID ────────────────────────────────────────────────────

  async getBookingById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        student: { include: { user: { select: { name: true, email: true, phone: true } } } },
        tutor: { include: { user: { select: { name: true, email: true } } } },
        classSession: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  // ─── UPDATE BOOKING STATUS (Tutor confirms/cancels) ───────────────────────

  async updateBookingStatus(
    id: string,
    tutorUserId: string,
    dto: UpdateBookingStatusDto,
  ) {
    const booking = await this.getBookingById(id);
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
    });

    if (!tutorProfile || booking.tutorId !== tutorProfile.id) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: dto.status as any,
        ...(dto.meetingLink && { meetingLink: dto.meetingLink }),
      },
    });
  }

  // ─── CANCEL BOOKING (Student cancels) ────────────────────────────────────

  async cancelBooking(id: string, studentUserId: string) {
    const booking = await this.getBookingById(id);
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });

    if (!studentProfile || booking.studentId !== studentProfile.id) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }
    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  // ─── START CLASS SESSION (Tutor starts session) ───────────────────────────

  async startSession(bookingId: string, tutorUserId: string) {
    const booking = await this.getBookingById(bookingId);
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
    });

    if (!tutorProfile || booking.tutorId !== tutorProfile.id) {
      throw new ForbiddenException('Only the assigned tutor can start the session');
    }
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Booking must be confirmed before starting');
    }

    return this.prisma.classSession.upsert({
      where: { bookingId },
      create: { bookingId, startedAt: new Date() },
      update: { startedAt: new Date() },
    });
  }

  // ─── END CLASS SESSION ────────────────────────────────────────────────────

  async endSession(bookingId: string, tutorUserId: string, recordingUrl?: string) {
    const booking = await this.getBookingById(bookingId);
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
    });

    if (!tutorProfile || booking.tutorId !== tutorProfile.id) {
      throw new ForbiddenException('Only the assigned tutor can end the session');
    }

    // Sequential updates (Neon HTTP doesn't support parallel transactions)
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

  // ─── ADMIN — ALL BOOKINGS ─────────────────────────────────────────────────

  async getAllBookings(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const bookings = await this.prisma.booking.findMany({
      where: { ...(status && { status: status as any }) },
      include: {
        student: { include: { user: { select: { name: true } } } },
        tutor: { include: { user: { select: { name: true } } } },
      },
      orderBy: { scheduledAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await this.prisma.booking.count({
      where: { ...(status && { status: status as any }) },
    });

    return { data: bookings, total, page, limit };
  }
}
