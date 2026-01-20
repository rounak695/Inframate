import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CampusService } from './campus.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/**
 * Campus Controller
 * 
 * Manages campus-related endpoints.
 */
@Controller('campuses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampusController {
    constructor(private readonly campusService: CampusService) { }

    /**
     * GET /campuses
     * Get all campuses (SUPER_ADMIN only)
     */
    @Get()
    @Roles('SUPER_ADMIN', 'ADMIN')
    findAll() {
        return this.campusService.findAll();
    }

    /**
     * GET /campuses/:id
     * Get campus by ID
     */
    @Get(':id')
    @Roles('SUPER_ADMIN', 'ADMIN')
    findOne(@Param('id') id: string) {
        return this.campusService.findOne(id);
    }
}
