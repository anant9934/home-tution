import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class TutorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(userId: string): Promise<{
        tutor: {
            id: string;
            name: string;
        };
        stats: {
            totalStudents: number;
            todaysClasses: number;
            pendingTasksCount: number;
            monthlyEarnings: string;
        };
        schedule: {
            id: string;
            title: string;
            type: string;
            students: number;
            time: Date;
            duration: string;
            status: import("src/generated/prisma").$Enums.BookingStatus;
            meetingLink: string | null;
        }[];
        actionRequired: {
            id: string;
            title: string;
            desc: string;
            type: string;
        }[];
    }>;
    getPublicTutors(): Promise<{
        id: string;
        name: string;
        subjects: string[];
        qualification: string | null;
        experience: string;
        hourlyRate: string;
        rating: number;
        reviews: number;
        image: string;
        isVerified: boolean;
    }[]>;
    create(createTutorDto: CreateTutorDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTutorDto: UpdateTutorDto): string;
    remove(id: number): string;
}
