import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateChapterDto, CreateLessonDto } from './dto/create-chapter.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
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
    findAll(subject?: string, cls?: string, board?: string, isPublished?: string): Promise<({
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
    getMyCourses(req: any): Promise<({
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
    findOne(id: string): Promise<{
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
    create(req: any, dto: CreateCourseDto): Promise<{
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
    update(id: string, req: any, dto: Partial<CreateCourseDto>): Promise<{
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
    publish(id: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
}
