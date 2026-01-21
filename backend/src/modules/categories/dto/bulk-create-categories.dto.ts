import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    icon: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsNumber()
    @Min(1)
    slaHours: number;
}

export class BulkCreateCategoriesDto {
    @IsString()
    @IsNotEmpty()
    campusId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryItemDto)
    categories: CategoryItemDto[];
}
