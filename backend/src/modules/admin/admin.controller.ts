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
}
