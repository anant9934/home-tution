import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  tutorId: string; // TutorProfile.id

  @IsDateString()
  scheduledAt: string;

  @IsInt()
  duration: number; // in minutes

  @IsString()
  @IsIn(['ONE_ON_ONE', 'GROUP_BATCH'])
  bookingType: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;
}

export class UpdateBookingStatusDto {
  @IsString()
  @IsIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
  status: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;
}
