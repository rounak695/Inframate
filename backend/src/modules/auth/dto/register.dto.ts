import { IsEmail, IsString, MinLength, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    campusId: string;

    @IsEnum(Role)
    role: Role;

    @IsString()
    phoneNumber?: string;

    @IsString()
    department?: string;

    @IsString()
    studentId?: string;
}
