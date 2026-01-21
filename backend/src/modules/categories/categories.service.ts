import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BulkCreateCategoriesDto } from './dto/bulk-create-categories.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany({
            include: {
                campus: true,
            },
        });
    }

    async bulkCreate(bulkCreateDto: BulkCreateCategoriesDto) {
        const { campusId, categories } = bulkCreateDto;

        const createdCategories = await this.prisma.$transaction(
            categories.map((category) =>
                this.prisma.category.create({
                    data: {
                        name: category.name,
                        icon: category.icon,
                        color: category.color,
                        slaConfig: {}, // Default empty SLA config
                        campusId,
                    },
                }),
            ),
        );

        return {
            message: `Successfully created ${createdCategories.length} categories`,
            categories: createdCategories,
        };
    }
}
