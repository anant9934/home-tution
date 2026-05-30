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
            bookingId: string;
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
    getPublicTutorDetails(tutorId: string): Promise<{
        id: string;
        name: string;
        subjects: string[];
        qualification: string | null;
        experience: string;
        hourlyRate: number;
        rating: number;
        reviews: number;
        image: string;
        isVerified: boolean;
        location: string;
        about: string;
    }>;
    bookDemo(userId: string, tutorId: string, slotIndex: number): Promise<{
        id: string;
        status: import("src/generated/prisma").$Enums.BookingStatus;
        scheduledAt: Date;
        studentId: string;
        duration: number;
        tutorId: string;
        bookingType: string;
        meetingLink: string | null;
        paymentStatus: string;
    }>;
    updateBookingStatus(bookingId: string, status: string): Promise<{
        id: string;
        status: import("src/generated/prisma").$Enums.BookingStatus;
        scheduledAt: Date;
        studentId: string;
        duration: number;
        tutorId: string;
        bookingType: string;
        meetingLink: string | null;
        paymentStatus: string;
    }>;
    scheduleClass(userId: string, data: {
        title: string;
        studentName: string;
        time: string;
    }): Promise<{
        id: string;
        status: import("src/generated/prisma").$Enums.BookingStatus;
        scheduledAt: Date;
        studentId: string;
        duration: number;
        tutorId: string;
        bookingType: string;
        meetingLink: string | null;
        paymentStatus: string;
    }>;
    create(createTutorDto: CreateTutorDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTutorDto: UpdateTutorDto): string;
    remove(id: number): string;
}
