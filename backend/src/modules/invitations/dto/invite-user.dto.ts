import { IsEmail, IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class InviteUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEnum(Role)
    role: Role;

    @IsString()
    @IsNotEmpty()
    campusId: string;

    @IsString()
    @IsOptional()
    department?: string;
}
