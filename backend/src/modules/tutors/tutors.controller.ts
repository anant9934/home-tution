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
