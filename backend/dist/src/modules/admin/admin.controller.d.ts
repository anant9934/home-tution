import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        stats: {
            totalStudents: number;
            totalTutors: number;
            totalCourses: number;
            totalRevenue: string;
        };
        pendingTutors: {
            id: string;
            name: string;
            subject: string;
            docStatus: string;
            appliedAt: Date;
        }[];
        recentBookings: {
            id: string;
            student: string;
            tutor: string;
            amount: string;
            status: import("src/generated/prisma").$Enums.BookingStatus;
        }[];
    }>;
    approveTutor(id: string): Promise<{
        id: string;
        isVerified: boolean;
        userId: string;
        bio: string | null;
        experienceYears: number;
        qualification: string | null;
        hourlyRate: number;
        languages: string[];
        subjects: string[];
        teachingMode: string;
        rating: number;
        totalReviews: number;
        verificationStatus: string;
        introVideoUrl: string | null;
    }>;
    rejectTutor(id: string): Promise<{
        id: string;
        isVerified: boolean;
        userId: string;
        bio: string | null;
        experienceYears: number;
        qualification: string | null;
        hourlyRate: number;
        languages: string[];
        subjects: string[];
        teachingMode: string;
        rating: number;
        totalReviews: number;
        verificationStatus: string;
        introVideoUrl: string | null;
    }>;
    createCourse(body: {
        title: string;
        subject: string;
        instructor: string;
    }): Promise<{
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
}
