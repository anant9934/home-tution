import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/parent-message.dto';
import { UpdateParentProfileDto } from './dto/update-parent-profile.dto';

@Controller('parents')
@UseGuards(JwtAuthGuard)
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  // ─── Dashboard overview ─────────────────────────────────────────────────
  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.parentsService.getDashboard(req.user.userId);
  }

  // ─── Children list ──────────────────────────────────────────────────────
  @Get('children')
  getChildren(@Request() req: any) {
    return this.parentsService.getChildren(req.user.userId);
  }

  // ─── Attendance ─────────────────────────────────────────────────────────
  @Get('attendance')
  getAttendance(@Request() req: any, @Query('childId') childId?: string) {
    return this.parentsService.getAttendance(req.user.userId, childId);
  }

  // ─── Fees ───────────────────────────────────────────────────────────────
  @Get('fees')
  getFees(@Request() req: any, @Query('childId') childId?: string) {
    return this.parentsService.getFees(req.user.userId, childId);
  }

  @Post('fees/:feeId/pay')
  payFee(@Request() req: any, @Param('feeId') feeId: string) {
    return this.parentsService.payFee(req.user.userId, feeId);
  }

  // ─── Performance ────────────────────────────────────────────────────────
  @Get('performance')
  getPerformance(@Request() req: any, @Query('childId') childId?: string) {
    return this.parentsService.getPerformance(req.user.userId, childId);
  }

  // ─── Messages ───────────────────────────────────────────────────────────
  @Get('messages')
  getMessages(@Request() req: any) {
    return this.parentsService.getMessages(req.user.userId);
  }

  @Post('messages')
  sendMessage(@Request() req: any, @Body() dto: SendMessageDto) {
    return this.parentsService.sendMessage(req.user.userId, dto);
  }

  // ─── Profile ────────────────────────────────────────────────────────────
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.parentsService.getProfile(req.user.userId);
  }

  @Patch('profile')
  updateProfile(@Request() req: any, @Body() dto: UpdateParentProfileDto) {
    return this.parentsService.updateProfile(req.user.userId, dto);
  }
}
