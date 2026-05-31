import { Controller, Get, UseGuards, Patch, Param, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Patch('tutors/:id/approve')
  approveTutor(@Param('id') id: string) {
    return this.adminService.updateTutorStatus(id, 'VERIFIED');
  }

  @Patch('tutors/:id/reject')
  rejectTutor(@Param('id') id: string) {
    return this.adminService.updateTutorStatus(id, 'REJECTED');
  }

  @Post('courses')
  createCourse(@Body() body: { title: string; subject: string; instructorId: string }) {
    return this.adminService.createCourse(body);
  }

  @Patch('courses/:id/publish')
  updateCourseStatus(@Param('id') id: string, @Body() body: { isPublished: boolean }) {
    return this.adminService.updateCourseStatus(id, body.isPublished);
  }

  @Get('students')
  getStudents() {
    return this.adminService.getStudents();
  }

  @Patch('students/:id/status')
  updateStudentStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateStudentStatus(id, body.status);
  }

  @Get('tutors')
  getTutors() {
    return this.adminService.getTutors();
  }

  @Get('courses')
  getCourses() {
    return this.adminService.getCourses();
  }

  @Get('fees')
  getFees() {
    return this.adminService.getFees();
  }

  @Get('analytics')
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('notifications')
  getNotifications() {
    return this.adminService.getNotifications();
  }

  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Post('settings')
  updateSettings(@Body() body: any) {
    return this.adminService.updateSettings(body);
  }
}
