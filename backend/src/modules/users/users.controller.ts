import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CampusAccessGuard } from '../../common/guards/campus-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CampusId, UserId } from '../../common/decorators/user.decorator';

/**
 * Users Controller
 * 
 * Manages user-related endpoints.
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, CampusAccessGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * GET /users/me
     * Get current user profile
     */
    @Get('me')
    getProfile(@UserId() userId: string) {
        return this.usersService.getProfile(userId);
    }

    /**
     * GET /users
     * Get all users in campus (STAFF and ADMIN only)
     */
    @Get()
    @Roles('STAFF', 'ADMIN')
    findAll(@CampusId() campusId: string) {
        return this.usersService.findAll(campusId);
    }

    /**
     * GET /users/:id
     * Get user by ID
     */
    @Get(':id')
    @Roles('STAFF', 'ADMIN')
    findOne(@Param('id') id: string, @CampusId() campusId: string) {
        return this.usersService.findOne(id, campusId);
    }
}
