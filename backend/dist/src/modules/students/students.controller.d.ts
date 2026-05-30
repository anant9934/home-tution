import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    getDashboard(req: any): Promise<{
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
    findOne(id: string): string;
    update(id: string, updateStudentDto: UpdateStudentDto): string;
    remove(id: string): string;
}
