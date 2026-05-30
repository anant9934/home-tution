import { TutorsService } from './tutors.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
export declare class TutorsController {
    private readonly tutorsService;
    constructor(tutorsService: TutorsService);
    getDashboard(req: any): Promise<{
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
    getPublicTutorDetails(id: string): Promise<{
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
    bookDemo(req: any, id: string, body: {
        slotIndex: number;
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
    updateBookingStatus(id: string, body: {
        status: string;
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
    scheduleClass(req: any, body: {
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
    findOne(id: string): string;
    update(id: string, updateTutorDto: UpdateTutorDto): string;
    remove(id: string): string;
}
