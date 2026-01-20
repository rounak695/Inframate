import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IssueStatus } from '@prisma/client';

export class UpdateIssueDto {
    @IsEnum(IssueStatus)
    @IsOptional()
    status?: IssueStatus;

    @IsString()
    @IsOptional()
    assignedTo?: string;

    @IsString()
    @IsOptional()
    resolutionNotes?: string;

    @IsString()
    @IsOptional()
    location?: string;
}
