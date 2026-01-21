import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('overview')
    getOverview(
        @CurrentUser() user: any,
        @Query('days', new ParseIntPipe({ optional: true })) days: number = 7,
    ) {
        return this.analyticsService.getOverviewStats(user.campusId, days);
    }

    @Get('metrics')
    getMetrics(
        @CurrentUser() user: any,
        @Query('days', new ParseIntPipe({ optional: true })) days: number = 7,
    ) {
        return this.analyticsService.getResolutionMetrics(user.campusId, days);
    }

    @Get('staff')
    getStaffPerformance(
        @CurrentUser() user: any,
        @Query('days', new ParseIntPipe({ optional: true })) days: number = 30,
    ) {
        return this.analyticsService.getStaffPerformance(user.campusId, days);
    }
}
