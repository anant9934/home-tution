import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateChapterDto, CreateLessonDto } from './dto/create-chapter.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── COURSES ──────────────────────────────────────────────────────────────

  async createCourse(tutorUserId: string, dto: CreateCourseDto) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
    });
    if (!tutor) throw new ForbiddenException('Only tutors can create courses');

    return this.prisma.course.create({
      data: {
        ...dto,
        createdBy: tutor.id,
      },
    });
  }

  async getPublicCourses() {
    const courses = await this.prisma.course.findMany({
      where: { isPublished: true },
    });

    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      subject: c.subject,
      description:
        c.description || 'Master the subject with our comprehensive guide.',
      instructor: 'Dr. Sarah Jenkins', // Fallback since relation isn't explicitly defined in schema
      rating: 4.8,
      students: Math.floor(Math.random() * 2000) + 100, // Mocked metrics
      price: 'Free',
      image:
        c.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80',
      duration: '8 weeks',
      level: 'Intermediate',
    }));
  }

  async findAllCourses(filters: {
    subject?: string;
    class?: string;
    board?: string;
    isPublished?: boolean;
  }) {
    return this.prisma.course.findMany({
      where: {
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.class && { class: filters.class }),
        ...(filters.board && { board: filters.board }),
        isPublished: filters.isPublished ?? true,
      },
      include: {
        _count: { select: { chapters: true, quizzes: true, assignments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        chapters: {
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        },
        assignments: { orderBy: { deadline: 'asc' } },
        quizzes: { orderBy: { startTime: 'asc' } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async updateCourse(
    id: string,
    tutorUserId: string,
    dto: Partial<CreateCourseDto>,
  ) {
    const course = await this.findCourseById(id);
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
    });
    if (!tutor || course.createdBy !== tutor.id) {
      throw new ForbiddenException('You can only edit your own courses');
    }
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async publishCourse(id: string, tutorUserId: string) {
    return this.updateCourse(id, tutorUserId, { isPublished: true });
  }

  async deleteCourse(id: string, tutorUserId: string) {
    const course = await this.findCourseById(id);
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
    });
    if (!tutor || course.createdBy !== tutor.id) {
      throw new ForbiddenException('You can only delete your own courses');
    }
    return this.prisma.course.delete({ where: { id } });
  }

  // ─── CHAPTERS ─────────────────────────────────────────────────────────────

  async createChapter(courseId: string, dto: CreateChapterDto) {
    await this.findCourseById(courseId);
    return this.prisma.chapter.create({
      data: { ...dto, courseId },
    });
  }

  async updateChapter(chapterId: string, dto: Partial<CreateChapterDto>) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
    });
    if (!chapter) throw new NotFoundException('Chapter not found');
    return this.prisma.chapter.update({ where: { id: chapterId }, data: dto });
  }

  async deleteChapter(chapterId: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
    });
    if (!chapter) throw new NotFoundException('Chapter not found');
    return this.prisma.chapter.delete({ where: { id: chapterId } });
  }

  // ─── LESSONS ──────────────────────────────────────────────────────────────

  async createLesson(chapterId: string, dto: CreateLessonDto) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
    });
    if (!chapter) throw new NotFoundException('Chapter not found');
    return this.prisma.lesson.create({
      data: { ...dto, chapterId },
    });
  }

  async updateLesson(lessonId: string, dto: Partial<CreateLessonDto>) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return this.prisma.lesson.update({ where: { id: lessonId }, data: dto });
  }

  async deleteLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return this.prisma.lesson.delete({ where: { id: lessonId } });
  }

  // ─── TUTOR'S COURSES ──────────────────────────────────────────────────────

  async getMyCourses(tutorUserId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
    });
    if (!tutor) throw new ForbiddenException('Tutor profile not found');
    return this.prisma.course.findMany({
      where: { createdBy: tutor.id },
      include: {
        _count: { select: { chapters: true, quizzes: true, assignments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
