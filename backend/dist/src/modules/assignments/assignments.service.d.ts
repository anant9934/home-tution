import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentsService {
    create(createAssignmentDto: CreateAssignmentDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAssignmentDto: UpdateAssignmentDto): string;
    remove(id: number): string;
}
