import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    create(createAssignmentDto: CreateAssignmentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAssignmentDto: UpdateAssignmentDto): string;
    remove(id: string): string;
}
