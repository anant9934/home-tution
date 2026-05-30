import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/create-booking.dto';
export declare class BookingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createBooking(studentUserId: string, dto: CreateBookingDto): Promise<{
        classSession: {
            id: string;
            bookingId: string;
            startedAt: Date | null;
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
        tutorId: string;
        bookingType: string;
        duration: number;
        meetingLink: string | null;
        paymentStatus: string;
    }>;
    getStudentBookings(studentUserId: string, status?: string): Promise<({
        classSession: {
            id: string;
            bookingId: string;
            startedAt: Date | null;
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
        tutorId: string;
        bookingType: string;
        duration: number;
        meetingLink: string | null;
        paymentStatus: string;
    })[]>;
    getTutorBookings(tutorUserId: string, status?: string): Promise<({
        classSession: {
            id: string;
            bookingId: string;
            startedAt: Date | null;
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
        tutorId: string;
        bookingType: string;
        duration: number;
        meetingLink: string | null;
        paymentStatus: string;
    })[]>;
    getBookingById(id: string): Promise<{
        classSession: {
            id: string;
            bookingId: string;
            startedAt: Date | null;
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
        tutorId: string;
        bookingType: string;
        duration: number;
        meetingLink: string | null;
        paymentStatus: string;
    }>;
    updateBookingStatus(id: string, tutorUserId: string, dto: UpdateBookingStatusDto): Promise<{
        id: string;
        status: import("src/generated/prisma").$Enums.BookingStatus;
        scheduledAt: Date;
        studentId: string;
        tutorId: string;
        bookingType: string;
        duration: number;
        meetingLink: string | null;
        paymentStatus: string;
    }>;
    cancelBooking(id: string, studentUserId: string): Promise<{
        id: string;
        status: import("src/generated/prisma").$Enums.BookingStatus;
        scheduledAt: Date;
        studentId: string;
        tutorId: string;
        bookingType: string;
        duration: number;
        meetingLink: string | null;
        paymentStatus: string;
    }>;
    startSession(bookingId: string, tutorUserId: string): Promise<{
        id: string;
        bookingId: string;
        startedAt: Date | null;
        endedAt: Date | null;
        recordingUrl: string | null;
        attendanceStatus: string | null;
    }>;
    endSession(bookingId: string, tutorUserId: string, recordingUrl?: string): Promise<{
        id: string;
        bookingId: string;
        startedAt: Date | null;
        endedAt: Date | null;
        recordingUrl: string | null;
        attendanceStatus: string | null;
    }>;
    getAllBookings(status?: string, page?: number, limit?: number): Promise<{
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
            tutorId: string;
            bookingType: string;
            duration: number;
            meetingLink: string | null;
            paymentStatus: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
}
