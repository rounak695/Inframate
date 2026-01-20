import { IsString, IsNotEmpty } from 'class-validator';

export class AssignIssueDto {
    @IsString()
    @IsNotEmpty()
    assignedTo: string;

    @IsString()
    notes?: string;
}
