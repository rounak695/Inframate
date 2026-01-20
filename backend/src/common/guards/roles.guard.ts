import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Roles Guard
 * 
 * Enforces role-based access control (RBAC).
 * Checks if user's role matches the roles specified in @Roles() decorator.
 * 
 * Apply globally or per-controller/route.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get required roles from @Roles() decorator
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If no roles specified, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // User must be authenticated (should be caught by JwtAuthGuard first)
        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        // Check if user's role matches any of the required roles
        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole) {
            throw new ForbiddenException(
                `This action requires one of the following roles: ${requiredRoles.join(', ')}`,
            );
        }

        return true;
    }
}
