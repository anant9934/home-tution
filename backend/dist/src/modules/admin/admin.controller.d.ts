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
}
