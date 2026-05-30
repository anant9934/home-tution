import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.studentsService.getDashboard(req.user.userId);
  }

  @Get('courses')
  getCourses(@Request() req: any) {
    return this.studentsService.getCourses(req.user.userId);
  }

  @Get('attendance')
  getAttendance(@Request() req: any) {
    return this.studentsService.getAttendance(req.user.userId);
  }

  @Get('assignments')
  getAssignments(@Request() req: any) {
    return this.studentsService.getAssignments(req.user.userId);
  }

  @Get('quizzes')
  getQuizzes(@Request() req: any) {
    return this.studentsService.getQuizzes(req.user.userId);
  }

  @Post('quizzes/:id/submit')
  submitQuiz(@Request() req: any, @Param('id') id: string, @Body('score') score: number) {
    return this.studentsService.submitQuiz(req.user.userId, id, score);
  }

  @Get('leaderboard')
  getLeaderboard(@Request() req: any) {
    return this.studentsService.getLeaderboard(req.user.userId);
  }

  @Get('messages')
  getMessages(@Request() req: any) {
    return this.studentsService.getMessages(req.user.userId);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.studentsService.getProfile(req.user.userId);
  }
}
