"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CoursesService = class CoursesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCourse(tutorUserId, dto) {
        const tutor = await this.prisma.tutorProfile.findUnique({
            where: { userId: tutorUserId },
        });
        if (!tutor)
            throw new common_1.ForbiddenException('Only tutors can create courses');
        return this.prisma.course.create({
            data: {
                ...dto,
                createdBy: tutor.id,
            },
        });
    }
    async findAllCourses(filters) {
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
    async findCourseById(id) {
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
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async updateCourse(id, tutorUserId, dto) {
        const course = await this.findCourseById(id);
        const tutor = await this.prisma.tutorProfile.findUnique({
            where: { userId: tutorUserId },
        });
        if (!tutor || course.createdBy !== tutor.id) {
            throw new common_1.ForbiddenException('You can only edit your own courses');
        }
        return this.prisma.course.update({ where: { id }, data: dto });
    }
    async publishCourse(id, tutorUserId) {
        return this.updateCourse(id, tutorUserId, { isPublished: true });
    }
    async deleteCourse(id, tutorUserId) {
        const course = await this.findCourseById(id);
        const tutor = await this.prisma.tutorProfile.findUnique({
            where: { userId: tutorUserId },
        });
        if (!tutor || course.createdBy !== tutor.id) {
            throw new common_1.ForbiddenException('You can only delete your own courses');
        }
        return this.prisma.course.delete({ where: { id } });
    }
    async createChapter(courseId, dto) {
        await this.findCourseById(courseId);
        return this.prisma.chapter.create({
            data: { ...dto, courseId },
        });
    }
    async updateChapter(chapterId, dto) {
        const chapter = await this.prisma.chapter.findUnique({
            where: { id: chapterId },
        });
        if (!chapter)
            throw new common_1.NotFoundException('Chapter not found');
        return this.prisma.chapter.update({ where: { id: chapterId }, data: dto });
    }
    async deleteChapter(chapterId) {
        const chapter = await this.prisma.chapter.findUnique({
            where: { id: chapterId },
        });
        if (!chapter)
            throw new common_1.NotFoundException('Chapter not found');
        return this.prisma.chapter.delete({ where: { id: chapterId } });
    }
    async createLesson(chapterId, dto) {
        const chapter = await this.prisma.chapter.findUnique({
            where: { id: chapterId },
        });
        if (!chapter)
            throw new common_1.NotFoundException('Chapter not found');
        return this.prisma.lesson.create({
            data: { ...dto, chapterId },
        });
    }
    async updateLesson(lessonId, dto) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        return this.prisma.lesson.update({ where: { id: lessonId }, data: dto });
    }
    async deleteLesson(lessonId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        return this.prisma.lesson.delete({ where: { id: lessonId } });
    }
    async getMyCourses(tutorUserId) {
        const tutor = await this.prisma.tutorProfile.findUnique({
            where: { userId: tutorUserId },
        });
        if (!tutor)
            throw new common_1.ForbiddenException('Tutor profile not found');
        return this.prisma.course.findMany({
            where: { createdBy: tutor.id },
            include: {
                _count: { select: { chapters: true, quizzes: true, assignments: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map