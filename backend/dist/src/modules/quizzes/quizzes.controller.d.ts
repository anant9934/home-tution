import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
export declare class QuizzesController {
    private readonly quizzesService;
    constructor(quizzesService: QuizzesService);
    create(createQuizDto: CreateQuizDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateQuizDto: UpdateQuizDto): string;
    remove(id: string): string;
}
