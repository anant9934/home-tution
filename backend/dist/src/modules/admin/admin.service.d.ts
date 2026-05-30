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
}
