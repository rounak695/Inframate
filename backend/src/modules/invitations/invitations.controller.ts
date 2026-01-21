import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) { }

    @Post('invite')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Invite user', description: 'Send invitation email to staff or student' })
    @ApiResponse({ status: 201, description: 'Invitation sent successfully' })
    @ApiResponse({ status: 400, description: 'User already exists' })
    async inviteUser(@Body() inviteDto: InviteUserDto) {
        return this.invitationsService.inviteUser(inviteDto);
    }

    @Get(':token')
    @ApiOperation({ summary: 'Validate invitation token' })
    @ApiResponse({ status: 200, description: 'Invitation valid' })
    @ApiResponse({ status: 404, description: 'Invalid or expired token' })
    async validateToken(@Param('token') token: string) {
        return this.invitationsService.validateToken(token);
    }

    @Post(':token/accept')
    @ApiOperation({ summary: 'Accept invitation', description: 'Complete registration using invitation token' })
    @ApiResponse({ status: 201, description: 'Account created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async acceptInvitation(
        @Param('token') token: string,
        @Body('password') password: string,
    ) {
        return this.invitationsService.acceptInvitation(token, password);
    }
}
