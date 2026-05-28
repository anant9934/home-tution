import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ─── STUDENT: create a booking ────────────────────────────────────────────
  @Post()
  @Roles('STUDENT' as any)
  @UseGuards(RolesGuard)
  create(@Request() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.userId, dto);
  }

  // ─── STUDENT: view own bookings ───────────────────────────────────────────
  @Get('my')
  @Roles('STUDENT' as any)
  @UseGuards(RolesGuard)
  getMyBookings(@Request() req: any, @Query('status') status?: string) {
    return this.bookingsService.getStudentBookings(req.user.userId, status);
  }

  // ─── STUDENT: cancel a booking ────────────────────────────────────────────
  @Patch(':id/cancel')
  @Roles('STUDENT' as any)
  @UseGuards(RolesGuard)
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.cancelBooking(id, req.user.userId);
  }

  // ─── TUTOR: view own bookings ─────────────────────────────────────────────
  @Get('tutor')
  @Roles('TUTOR' as any)
  @UseGuards(RolesGuard)
  getTutorBookings(@Request() req: any, @Query('status') status?: string) {
    return this.bookingsService.getTutorBookings(req.user.userId, status);
  }

  // ─── TUTOR: confirm / update booking ─────────────────────────────────────
  @Patch(':id/status')
  @Roles('TUTOR' as any)
  @UseGuards(RolesGuard)
  updateStatus(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(id, req.user.userId, dto);
  }

  // ─── TUTOR: start class session ───────────────────────────────────────────
  @Post(':id/session/start')
  @Roles('TUTOR' as any)
  @UseGuards(RolesGuard)
  startSession(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.startSession(id, req.user.userId);
  }

  // ─── TUTOR: end class session ─────────────────────────────────────────────
  @Patch(':id/session/end')
  @Roles('TUTOR' as any)
  @UseGuards(RolesGuard)
  endSession(
    @Param('id') id: string,
    @Request() req: any,
    @Body('recordingUrl') recordingUrl?: string,
  ) {
    return this.bookingsService.endSession(id, req.user.userId, recordingUrl);
  }

  // ─── ADMIN: all bookings ──────────────────────────────────────────────────
  @Get('admin/all')
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @UseGuards(RolesGuard)
  getAllBookings(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.getAllBookings(
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  // ─── ANY: get one booking by ID ───────────────────────────────────────────
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }
}
