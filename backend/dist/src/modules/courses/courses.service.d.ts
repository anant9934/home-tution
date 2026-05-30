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
        isPublished: boolean;
        createdBy: string;
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
        isPublished: boolean;
        createdBy: string;
    })[]>;
    findCourseById(id: string): Promise<{
        chapters: ({
            lessons: {
                id: string;
                duration: number;
                title: string;
                order: number;
                videoUrl: string | null;
                notesUrl: string | null;
                chapterId: string;
            }[];
        } & {
            id: string;
            title: string;
            order: number;
            courseId: string;
        })[];
        assignments: {
            id: string;
            title: string;
            description: string | null;
            createdBy: string;
            deadline: Date;
            courseId: string;
            maxMarks: number;
            attachmentUrl: string | null;
        }[];
        quizzes: {
            id: string;
            duration: number;
            title: string;
            createdBy: string;
            startTime: Date | null;
            courseId: string;
            totalMarks: number;
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
        isPublished: boolean;
        createdBy: string;
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
        isPublished: boolean;
        createdBy: string;
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
        isPublished: boolean;
        createdBy: string;
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
        isPublished: boolean;
        createdBy: string;
    }>;
    createChapter(courseId: string, dto: CreateChapterDto): Promise<{
        id: string;
        title: string;
        order: number;
        courseId: string;
    }>;
    updateChapter(chapterId: string, dto: Partial<CreateChapterDto>): Promise<{
        id: string;
        title: string;
        order: number;
        courseId: string;
    }>;
    deleteChapter(chapterId: string): Promise<{
        id: string;
        title: string;
        order: number;
        courseId: string;
    }>;
    createLesson(chapterId: string, dto: CreateLessonDto): Promise<{
        id: string;
        duration: number;
        title: string;
        order: number;
        videoUrl: string | null;
        notesUrl: string | null;
        chapterId: string;
    }>;
    updateLesson(lessonId: string, dto: Partial<CreateLessonDto>): Promise<{
        id: string;
        duration: number;
        title: string;
        order: number;
        videoUrl: string | null;
        notesUrl: string | null;
        chapterId: string;
    }>;
    deleteLesson(lessonId: string): Promise<{
        id: string;
        duration: number;
        title: string;
        order: number;
        videoUrl: string | null;
        notesUrl: string | null;
        chapterId: string;
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
        isPublished: boolean;
        createdBy: string;
    })[]>;
}
