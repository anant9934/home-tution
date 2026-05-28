import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
export declare class TutorsService {
    create(createTutorDto: CreateTutorDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTutorDto: UpdateTutorDto): string;
    remove(id: number): string;
}
