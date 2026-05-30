import { Controller, Get, UseGuards, Patch, Param, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tutors/:id/approve')
  approveTutor(@Param('id') id: string) {
    return this.adminService.updateTutorStatus(id, 'VERIFIED');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tutors/:id/reject')
  rejectTutor(@Param('id') id: string) {
    return this.adminService.updateTutorStatus(id, 'REJECTED');
  }

  @UseGuards(JwtAuthGuard)
  @Post('courses')
  createCourse(@Body() body: { title: string; subject: string; instructor: string }) {
    return this.adminService.createCourse(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('students')
  getStudents() {
    return this.adminService.getStudents();
  }

  @UseGuards(JwtAuthGuard)
  @Get('tutors')
  getTutors() {
    return this.adminService.getTutors();
  }

  @UseGuards(JwtAuthGuard)
  @Get('courses')
  getCourses() {
    return this.adminService.getCourses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('fees')
  getFees() {
    return this.adminService.getFees();
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  getNotifications() {
    return this.adminService.getNotifications();
  }

  @UseGuards(JwtAuthGuard)
  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }
}
