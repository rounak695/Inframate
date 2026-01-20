import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    MinLength,
} from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateIssueDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: 'Title must be at least 5 characters' })
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'Description must be at least 10 characters' })
    description: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsEnum(Priority)
    priority: Priority;

    @IsString()
    @IsOptional()
    location?: string;
}
