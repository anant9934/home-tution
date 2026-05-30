import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
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
    updateTutorStatus(id: string, status: string): Promise<{
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
    createCourse(data: {
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
