import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * 
 * Specify which roles can access a route.
 * Used in conjunction with RolesGuard.
 * 
 * Usage:
 * @Roles('ADMIN', 'STAFF')
 * @Get('users')
 * getUsers() { ... }
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
