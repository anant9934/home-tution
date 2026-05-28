import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        studentProfile: {
            id: string;
            class: string;
            board: string;
            schoolName: string | null;
            dateOfBirth: Date | null;
            joiningDate: Date;
            address: string | null;
            userId: string;
            parentId: string | null;
            assignedTutorId: string | null;
        } | null;
        parentProfile: {
            id: string;
            address: string | null;
            userId: string;
            occupation: string | null;
        } | null;
        tutorProfile: {
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
        } | null;
        email: string;
        role: import("src/generated/prisma").$Enums.Role;
        id: string;
        phone: string | null;
        name: string;
        avatarUrl: string | null;
        isVerified: boolean;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
