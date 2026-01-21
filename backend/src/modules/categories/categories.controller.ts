import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { BulkCreateCategoriesDto } from './dto/bulk-create-categories.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Post('bulk')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Bulk create categories' })
    @ApiResponse({ status: 201, description: 'Categories created' })
    bulkCreate(@Body() bulkCreateDto: BulkCreateCategoriesDto) {
        return this.categoriesService.bulkCreate(bulkCreateDto);
    }
}
