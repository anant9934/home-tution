import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsService {
    create(createBookingDto: CreateBookingDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateBookingDto: UpdateBookingDto): string;
    remove(id: number): string;
}
