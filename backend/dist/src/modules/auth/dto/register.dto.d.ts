import { Role } from '../../../generated/prisma';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    phoneNumber?: string;
}
