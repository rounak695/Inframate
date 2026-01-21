import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(128)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string;

    @IsString()
    @IsNotEmpty()
    campusId: string;

    @IsEnum(Role)
    role: Role;

    @IsString()
    @MaxLength(20)
    phoneNumber?: string;

    @IsString()
    @MaxLength(200)
    department?: string;

    @IsString()
    @MaxLength(50)
    studentId?: string;
}
