import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class StudentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(userId: string): Promise<{
        student: {
            id: string;
            class: string;
            board: string;
        };
        stats: {
            currentStreak: number;
            weeklyGoal: number;
            totalXP: number;
        };
        schedule: {
            id: string;
            title: string;
            tutor: string;
            time: Date;
            status: import("src/generated/prisma").$Enums.BookingStatus;
            type: string;
        }[];
        leaderboard: ({
            rank: number;
            name: string;
            xp: number;
            isCurrent?: undefined;
        } | {
            rank: number;
            name: string;
            xp: number;
            isCurrent: boolean;
        })[];
        activeCourses: {
            id: string;
            title: string;
            subject: string;
            progress: number;
            totalParts: number;
            completedParts: number;
        }[];
        pendingTasks: {
            id: string;
            title: string;
            type: string;
            dueAt: Date;
            status: string;
        }[];
    }>;
    create(createStudentDto: CreateStudentDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStudentDto: UpdateStudentDto): string;
    remove(id: number): string;
}
