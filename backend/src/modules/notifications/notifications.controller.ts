import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    getMyNotifications(@GetUser() user: any) {
        return this.notificationsService.getMyNotifications(user.id);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string, @GetUser() user: any) {
        return this.notificationsService.markAsRead(id, user.id);
    }
}
