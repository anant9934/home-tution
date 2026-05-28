export declare class CreateBookingDto {
    tutorId: string;
    scheduledAt: string;
    duration: number;
    bookingType: string;
    meetingLink?: string;
}
export declare class UpdateBookingStatusDto {
    status: string;
    meetingLink?: string;
}
