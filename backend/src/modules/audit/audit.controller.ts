import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    async getAuditLogs(
        @CurrentUser() user: any,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50',
        @Query('action') action?: string,
        @Query('entityType') entityType?: string,
        @Query('userId') userId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const filters: any = {};
        if (action) filters.action = action;
        if (entityType) filters.entityType = entityType;
        if (userId) filters.userId = userId;
        if (startDate) filters.startDate = new Date(startDate);
        if (endDate) filters.endDate = new Date(endDate);

        return this.auditService.getAll(
            user.campusId,
            filters,
            { page: parseInt(page), limit: parseInt(limit) },
        );
    }
}
