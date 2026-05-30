import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    getDashboard(req: any): Promise<{
        studentName: string;
        xp: number;
        streak: number;
        enrolledCourses: {
            id: string;
            title: string;
            instructor: string;
            progress: number;
            nextLesson: string;
        }[];
        pendingTasks: {
            id: string;
            title: string;
            type: string;
            subject: string;
            due: string;
        }[];
        upcomingClasses: {
            id: string;
            title: string;
            time: string;
            tutor: string;
        }[];
        recentAchievements: string[];
    }>;
    getCourses(req: any): Promise<{
        id: string;
        title: string;
        subject: string;
        description: string;
        instructor: string;
        progress: number;
        chapters: {
            title: string;
            lessons: string[];
        }[];
    }[]>;
    getAttendance(req: any): Promise<{
        stats: {
            presentDays: number;
            absentDays: number;
            totalDays: number;
            percentage: number;
        };
        records: {
            id: string;
            date: string;
            subject: string;
            status: import("src/generated/prisma").$Enums.AttendanceStatus;
            teacher: string;
        }[];
    }>;
    getAssignments(req: any): Promise<{
        pending: {
            id: string;
            title: string;
            subject: string;
            dueDate: string;
            marks: number;
        }[];
        submitted: {
            id: string;
            title: string;
            subject: string;
            submittedAt: string;
            score: string;
            status: string;
        }[];
    }>;
    getQuizzes(req: any): Promise<{
        pending: {
            id: string;
            title: string;
            subject: string;
            duration: number;
            questions: {
                id: string;
                text: string;
                options: string[];
                correctAnswer: string;
            }[];
        }[];
        completed: {
            id: string;
            title: string;
            subject: string;
            score: string;
            date: string;
        }[];
    }>;
    submitQuiz(req: any, id: string, score: number): Promise<{
        success: boolean;
        attempt: {
            id: string;
            studentId: string;
            quizId: string;
            score: number;
            startedAt: Date;
            submittedAt: Date | null;
            timeTaken: number | null;
        };
        xpEarned: number;
    }>;
    getLeaderboard(req: any): Promise<{
        rank: number;
        id: string;
        name: string;
        avatar: string;
        xp: number;
        badges: number;
        isCurrent: boolean;
    }[]>;
    getMessages(req: any): Promise<({
        messages: ({
            sender: {
                email: string;
                role: import("src/generated/prisma").$Enums.Role;
                id: string;
                phone: string | null;
                name: string;
                passwordHash: string;
                avatarUrl: string | null;
                isVerified: boolean;
                status: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            attachmentUrl: string | null;
            senderId: string;
            conversationId: string;
            messageText: string | null;
            seen: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        type: string;
    })[]>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        class: string;
        board: string;
        school: string | null;
        joiningDate: string;
    }>;
}
