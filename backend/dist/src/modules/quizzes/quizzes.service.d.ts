import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
export declare class QuizzesService {
    create(createQuizDto: CreateQuizDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateQuizDto: UpdateQuizDto): string;
    remove(id: number): string;
}
