import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateBookingDto: UpdateBookingDto): string;
    remove(id: string): string;
}
