import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateChapterDto, CreateLessonDto } from './dto/create-chapter.dto';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCourse(tutorUserId: string, dto: CreateCourseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        class: string;
        board: string;
        title: string;
        description: string | null;
        subject: string;
        thumbnail: string | null;
        createdBy: string;
        isPublished: boolean;
    }>;
    getPublicCourses(): Promise<{
        id: string;
        title: string;
        subject: string;
        description: string;
        instructor: string;
        rating: number;
        students: number;
        price: string;
        image: string;
        duration: string;
        level: string;
    }[]>;
    findAllCourses(filters: {
        subject?: string;
        class?: string;
        board?: string;
        isPublished?: boolean;
    }): Promise<({
        _count: {
            chapters: number;
            assignments: number;
            quizzes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        class: string;
        board: string;
        title: string;
        description: string | null;
        subject: string;
        thumbnail: string | null;
        createdBy: string;
        isPublished: boolean;
    })[]>;
    findCourseById(id: string): Promise<{
        chapters: ({
            lessons: {
                id: string;
                title: string;
                duration: number;
                order: number;
                chapterId: string;
                videoUrl: string | null;
                notesUrl: string | null;
            }[];
        } & {
            id: string;
            title: string;
            courseId: string;
            order: number;
        })[];
        assignments: {
            id: string;
            title: string;
            description: string | null;
            createdBy: string;
            courseId: string;
            deadline: Date;
            maxMarks: number;
            attachmentUrl: string | null;
        }[];
        quizzes: {
            id: string;
            title: string;
            createdBy: string;
            courseId: string;
            duration: number;
            totalMarks: number;
            startTime: Date | null;
            endTime: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        class: string;
        board: string;
        title: string;
        description: string | null;
        subject: string;
        thumbnail: string | null;
        createdBy: string;
        isPublished: boolean;
    }>;
    updateCourse(id: string, tutorUserId: string, dto: Partial<CreateCourseDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        class: string;
        board: string;
        title: string;
        description: string | null;
        subject: string;
        thumbnail: string | null;
        createdBy: string;
        isPublished: boolean;
    }>;
    publishCourse(id: string, tutorUserId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        class: string;
        board: string;
        title: string;
        description: string | null;
        subject: string;
        thumbnail: string | null;
        createdBy: string;
        isPublished: boolean;
    }>;
    deleteCourse(id: string, tutorUserId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        class: string;
        board: string;
        title: string;
        description: string | null;
        subject: string;
        thumbnail: string | null;
        createdBy: string;
        isPublished: boolean;
    }>;
    createChapter(courseId: string, dto: CreateChapterDto): Promise<{
        id: string;
        title: string;
        courseId: string;
        order: number;
    }>;
    updateChapter(chapterId: string, dto: Partial<CreateChapterDto>): Promise<{
        id: string;
        title: string;
        courseId: string;
        order: number;
    }>;
    deleteChapter(chapterId: string): Promise<{
        id: string;
        title: string;
        courseId: string;
        order: number;
    }>;
    createLesson(chapterId: string, dto: CreateLessonDto): Promise<{
        id: string;
        title: string;
        duration: number;
        order: number;
        chapterId: string;
        videoUrl: string | null;
        notesUrl: string | null;
    }>;
    updateLesson(lessonId: string, dto: Partial<CreateLessonDto>): Promise<{
        id: string;
        title: string;
        duration: number;
        order: number;
        chapterId: string;
        videoUrl: string | null;
        notesUrl: string | null;
    }>;
    deleteLesson(lessonId: string): Promise<{
        id: string;
        title: string;
        duration: number;
        order: number;
        chapterId: string;
        videoUrl: string | null;
        notesUrl: string | null;
    }>;
    getMyCourses(tutorUserId: string): Promise<({
        _count: {
            chapters: number;
            assignments: number;
            quizzes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        class: string;
        board: string;
        title: string;
        description: string | null;
        subject: string;
        thumbnail: string | null;
        createdBy: string;
        isPublished: boolean;
    })[]>;
}
