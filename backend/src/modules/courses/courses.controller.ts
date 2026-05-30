import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateChapterDto, CreateLessonDto } from './dto/create-chapter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ─── COURSES ──────────────────────────────────────────────────────────────

  /** GET /courses/public — public list */
  @Get('public')
  getPublicCourses() {
    return this.coursesService.getPublicCourses();
  }

  /** GET /courses — public list (published only by default) */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('subject') subject?: string,
    @Query('class') cls?: string,
    @Query('board') board?: string,
    @Query('isPublished') isPublished?: string,
  ) {
    return this.coursesService.findAllCourses({
      subject,
      class: cls,
      board,
      isPublished: isPublished === 'false' ? false : true,
    });
  }

  /** GET /courses/mine — tutor's own courses */
  @Get('mine')
  @Roles('TUTOR' as any)
  @UseGuards(RolesGuard)
  getMyCourses(@Request() req: any) {
    return this.coursesService.getMyCourses(req.user.userId);
  }

  /** GET /courses/:id — full course with chapters & lessons */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findCourseById(id);
  }

  /** POST /courses — create a new course */
  @Post()
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  create(@Request() req: any, @Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(req.user.userId, dto);
  }

  /** PATCH /courses/:id — update course */
  @Patch(':id')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: Partial<CreateCourseDto>,
  ) {
    return this.coursesService.updateCourse(id, req.user.userId, dto);
  }

  /** PATCH /courses/:id/publish — publish a course */
  @Patch(':id/publish')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  publish(@Param('id') id: string, @Request() req: any) {
    return this.coursesService.publishCourse(id, req.user.userId);
  }

  /** DELETE /courses/:id */
  @Delete(':id')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.coursesService.deleteCourse(id, req.user.userId);
  }

  // ─── CHAPTERS ─────────────────────────────────────────────────────────────

  /** POST /courses/:courseId/chapters */
  @Post(':courseId/chapters')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  createChapter(
    @Param('courseId') courseId: string,
    @Body() dto: CreateChapterDto,
  ) {
    return this.coursesService.createChapter(courseId, dto);
  }

  /** PATCH /courses/chapters/:chapterId */
  @Patch('chapters/:chapterId')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  updateChapter(
    @Param('chapterId') chapterId: string,
    @Body() dto: Partial<CreateChapterDto>,
  ) {
    return this.coursesService.updateChapter(chapterId, dto);
  }

  /** DELETE /courses/chapters/:chapterId */
  @Delete('chapters/:chapterId')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  deleteChapter(@Param('chapterId') chapterId: string) {
    return this.coursesService.deleteChapter(chapterId);
  }

  // ─── LESSONS ──────────────────────────────────────────────────────────────

  /** POST /courses/chapters/:chapterId/lessons */
  @Post('chapters/:chapterId/lessons')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  createLesson(
    @Param('chapterId') chapterId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.coursesService.createLesson(chapterId, dto);
  }

  /** PATCH /courses/lessons/:lessonId */
  @Patch('lessons/:lessonId')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() dto: Partial<CreateLessonDto>,
  ) {
    return this.coursesService.updateLesson(lessonId, dto);
  }

  /** DELETE /courses/lessons/:lessonId */
  @Delete('lessons/:lessonId')
  @Roles('TUTOR' as any, 'ADMIN' as any)
  @UseGuards(RolesGuard)
  deleteLesson(@Param('lessonId') lessonId: string) {
    return this.coursesService.deleteLesson(lessonId);
  }
}
