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
        isPublished: boolean;
        createdBy: string;
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
        isPublished: boolean;
        createdBy: string;
    })[]>;
    findOne(id: string): Promise<{
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
        isPublished: boolean;
        createdBy: string;
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
        isPublished: boolean;
        createdBy: string;
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
        isPublished: boolean;
        createdBy: string;
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
}
