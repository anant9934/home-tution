import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.tutorsService.getDashboard(req.user.userId);
  }

  @Get('public')
  getPublicTutors() {
    return this.tutorsService.getPublicTutors();
  }

  @Get('public/:id')
  getPublicTutorDetails(@Param('id') id: string) {
    return this.tutorsService.getPublicTutorDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('public/:id/book')
  bookDemo(@Request() req: any, @Param('id') id: string, @Body() body: { slotIndex: number }) {
    return this.tutorsService.bookDemo(req.user.userId, id, body.slotIndex);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bookings/:id/status')
  updateBookingStatus(@Param('id') id: string, @Body() body: { status: string, meetingLink?: string }) {
    return this.tutorsService.updateBookingStatus(id, body.status, body.meetingLink);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  scheduleClass(@Request() req: any, @Body() body: { title: string; studentName: string; time: string }) {
    return this.tutorsService.scheduleClass(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('students')
  getStudents(@Request() req: any) {
    return this.tutorsService.getStudents(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('classes')
  getClasses(@Request() req: any) {
    return this.tutorsService.getClasses(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assignments')
  getAssignments(@Request() req: any) {
    return this.tutorsService.getAssignments(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('assignments')
  createAssignment(@Request() req: any, @Body() body: any) {
    return this.tutorsService.createAssignment(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('submissions/:id/grade')
  gradeSubmission(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.tutorsService.gradeSubmission(req.user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('quizzes')
  getQuizzes(@Request() req: any) {
    return this.tutorsService.getQuizzes(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('quizzes')
  createQuiz(@Request() req: any, @Body() body: any) {
    return this.tutorsService.createQuiz(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('quizzes/:id/questions')
  addQuestionsToQuiz(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.tutorsService.addQuestionsToQuiz(req.user.userId, id, body.questions);
  }

  @UseGuards(JwtAuthGuard)
  @Get('attendance')
  getAttendance(@Request() req: any) {
    return this.tutorsService.getAttendance(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attendance')
  markAttendance(@Request() req: any, @Body() body: { bookingId: string, status: string }) {
    return this.tutorsService.markAttendance(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('earnings')
  getEarnings(@Request() req: any) {
    return this.tutorsService.getEarnings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.tutorsService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Request() req: any, @Body() body: any) {
    return this.tutorsService.updateProfile(req.user.userId, body);
  }
}
