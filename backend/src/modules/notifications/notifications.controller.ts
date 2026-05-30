import { Controller, Get, Patch, Param, UseGuards, Request, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getUserNotifications(@Request() req: any) {
    return this.notificationsService.getUserNotifications(req.user.userId);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  // Debug/Test endpoint to generate a notification quickly
  @Post('test')
  createTestNotification(@Request() req: any, @Body() body: { title: string, message: string, type?: string }) {
    return this.notificationsService.createNotification(
      req.user.userId,
      body.title || 'Test Notification',
      body.message || 'This is a test notification.',
      body.type || 'ANNOUNCEMENT'
    );
  }
}
