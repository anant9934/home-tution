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
  updateBookingStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.tutorsService.updateBookingStatus(id, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  scheduleClass(@Request() req: any, @Body() body: { title: string; studentName: string; time: string }) {
    return this.tutorsService.scheduleClass(req.user.userId, body);
  }

  @Post()
  create(@Body() createTutorDto: CreateTutorDto) {
    return this.tutorsService.create(createTutorDto);
  }

  @Get()
  findAll() {
    return this.tutorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTutorDto: UpdateTutorDto) {
    return this.tutorsService.update(+id, updateTutorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorsService.remove(+id);
  }
}
