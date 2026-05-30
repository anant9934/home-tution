import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, dto: CreateBookingDto): Promise<{
        classSession: {
            id: string;
            startedAt: Date | null;
            bookingId: string;
            endedAt: Date | null;
            recordingUrl: string | null;
            attendanceStatus: string | null;
        } | null;
        student: {
            user: {
                email: string;
                phone: string | null;
                name: string;
            };
        } & {
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
        };
        tutor: {
            user: {
                email: string;
                name: string;
            };
        } & {
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
        };
    } & {
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
    getMyBookings(req: any, status?: string): Promise<({
        classSession: {
            id: string;
            startedAt: Date | null;
            bookingId: string;
            endedAt: Date | null;
            recordingUrl: string | null;
            attendanceStatus: string | null;
        } | null;
        tutor: {
            user: {
                email: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
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
        };
    } & {
        id: string;
        status: import("src/generated/prisma").$Enums.BookingStatus;
        scheduledAt: Date;
        studentId: string;
        duration: number;
        tutorId: string;
        bookingType: string;
        meetingLink: string | null;
        paymentStatus: string;
    })[]>;
    cancel(id: string, req: any): Promise<{
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
    getTutorBookings(req: any, status?: string): Promise<({
        classSession: {
            id: string;
            startedAt: Date | null;
            bookingId: string;
            endedAt: Date | null;
            recordingUrl: string | null;
            attendanceStatus: string | null;
        } | null;
        student: {
            user: {
                email: string;
                phone: string | null;
                name: string;
                avatarUrl: string | null;
            };
        } & {
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
        };
    } & {
        id: string;
        status: import("src/generated/prisma").$Enums.BookingStatus;
        scheduledAt: Date;
        studentId: string;
        duration: number;
        tutorId: string;
        bookingType: string;
        meetingLink: string | null;
        paymentStatus: string;
    })[]>;
    updateStatus(id: string, req: any, dto: UpdateBookingStatusDto): Promise<{
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
    startSession(id: string, req: any): Promise<{
        id: string;
        startedAt: Date | null;
        bookingId: string;
        endedAt: Date | null;
        recordingUrl: string | null;
        attendanceStatus: string | null;
    }>;
    endSession(id: string, req: any, recordingUrl?: string): Promise<{
        id: string;
        startedAt: Date | null;
        bookingId: string;
        endedAt: Date | null;
        recordingUrl: string | null;
        attendanceStatus: string | null;
    }>;
    getAllBookings(status?: string, page?: string, limit?: string): Promise<{
        data: ({
            student: {
                user: {
                    name: string;
                };
            } & {
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
            };
            tutor: {
                user: {
                    name: string;
                };
            } & {
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
            };
        } & {
            id: string;
            status: import("src/generated/prisma").$Enums.BookingStatus;
            scheduledAt: Date;
            studentId: string;
            duration: number;
            tutorId: string;
            bookingType: string;
            meetingLink: string | null;
            paymentStatus: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOne(id: string): Promise<{
        classSession: {
            id: string;
            startedAt: Date | null;
            bookingId: string;
            endedAt: Date | null;
            recordingUrl: string | null;
            attendanceStatus: string | null;
        } | null;
        student: {
            user: {
                email: string;
                phone: string | null;
                name: string;
            };
        } & {
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
        };
        tutor: {
            user: {
                email: string;
                name: string;
            };
        } & {
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
        };
    } & {
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
}
