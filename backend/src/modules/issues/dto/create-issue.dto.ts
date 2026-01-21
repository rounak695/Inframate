import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    MinLength,
    MaxLength,
    IsArray,
} from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateIssueDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: 'Title must be at least 5 characters' })
    @MaxLength(200)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'Description must be at least 10 characters' })
    @MaxLength(5000)
    description: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsEnum(Priority)
    priority: Priority;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    location?: string;

    @IsArray()
    @IsOptional()
    attachments?: string[];
}
