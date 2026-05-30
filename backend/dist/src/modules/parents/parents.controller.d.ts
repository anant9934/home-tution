import { ParentsService } from './parents.service';
import { SendMessageDto } from './dto/parent-message.dto';
import { UpdateParentProfileDto } from './dto/update-parent-profile.dto';
export declare class ParentsController {
    private readonly parentsService;
    constructor(parentsService: ParentsService);
    getDashboard(req: any): Promise<{
        childName: string;
        children: {
            id: string;
            name: string;
            class: string;
            board: string;
        }[];
        stats: {
            attendance: string;
            overallGrade: string;
            pendingFees: string;
            teacherNotesCount: number;
        };
        performance: {
            title: string;
            score: number;
            color: string;
        }[];
        homework: {
            title: string;
            subject: string;
            status: string;
            isWarning: boolean;
            marks: number | null;
            maxMarks: number;
        }[];
        feedback: {
            tutorName: string;
            subject: string;
            date: string;
            note: string;
        }[];
        upcomingClasses: {
            id: string;
            title: string;
            time: string;
            tutor: string;
            meetingLink: string | null;
        }[];
    }>;
    getChildren(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        class: string;
        board: string;
        schoolName: string | null;
        avatarUrl: string | null;
    }[]>;
    getAttendance(req: any, childId?: string): Promise<{
        childName: string;
        summary: {
            total: number;
            present: number;
            absent: number;
            late: number;
            percentage: number;
        };
        records: {
            id: string;
            date: string;
            status: import("src/generated/prisma").$Enums.AttendanceStatus;
            tutor: string;
            subject: string;
        }[];
    }>;
    getFees(req: any, childId?: string): Promise<{
        childName: string;
        summary: {
            totalPending: string;
            totalPaid: string;
            pendingCount: number;
        };
        fees: {
            id: string;
            month: number;
            year: number;
            amount: number;
            dueDate: string;
            status: string;
            payment: {
                transactionId: string;
                paidAt: string;
                gateway: string;
            } | null;
        }[];
    }>;
    payFee(req: any, feeId: string): Promise<{
        message: string;
        fee: {
            id: string;
            status: string;
            year: number;
            studentId: string;
            amount: number;
            dueDate: Date;
            month: number;
        };
        transactionId?: undefined;
    } | {
        message: string;
        transactionId: string;
        fee: {
            id: string;
            amount: number;
            status: string;
            month: number;
            year: number;
        };
    }>;
    getPerformance(req: any, childId?: string): Promise<{
        childName: string;
        totalXP: number;
        badges: {
            name: string;
            icon: string;
            earnedAt: string;
        }[];
        subjectPerformance: {
            subject: string;
            percentage: number;
            quizzesTaken: number;
            color: string;
        }[];
        quizHistory: {
            id: string;
            quizTitle: string;
            subject: string;
            score: number;
            totalMarks: number;
            percentage: number;
            date: string;
            timeTaken: number | null;
        }[];
        assignmentHistory: {
            id: string;
            title: string;
            subject: string;
            marks: number | null;
            maxMarks: number;
            percentage: number | null;
            feedback: string | null;
            date: string;
        }[];
    }>;
    getMessages(req: any): Promise<{
        id: string;
        otherUser: {
            id: string;
            name: string;
            role: import("src/generated/prisma").$Enums.Role;
            avatarUrl: string | null;
        } | null;
        lastMessage: {
            text: string | null;
            date: string;
            isOwn: boolean;
        } | null;
        unreadCount: number;
        messages: {
            id: string;
            text: string | null;
            senderId: string;
            senderName: string;
            isOwn: boolean;
            seen: boolean;
            date: string;
        }[];
    }[]>;
    sendMessage(req: any, dto: SendMessageDto): Promise<{
        id: string;
        conversationId: string;
        text: string | null;
        senderName: string;
        date: string;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        occupation: string | null;
        address: string | null;
        children: {
            id: string;
            name: string;
            class: string;
            board: string;
            schoolName: string | null;
        }[];
    }>;
    updateProfile(req: any, dto: UpdateParentProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        occupation: string | null;
        address: string | null;
        children: {
            id: string;
            name: string;
            class: string;
            board: string;
            schoolName: string | null;
        }[];
    }>;
}
