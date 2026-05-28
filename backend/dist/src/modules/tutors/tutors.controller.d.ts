import { TutorsService } from './tutors.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
export declare class TutorsController {
    private readonly tutorsService;
    constructor(tutorsService: TutorsService);
    create(createTutorDto: CreateTutorDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTutorDto: UpdateTutorDto): string;
    remove(id: string): string;
}
