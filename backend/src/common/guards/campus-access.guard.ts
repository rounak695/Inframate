import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Campus Access Guard
 * 
 * Ensures users can only access data from their own campus (multi-tenancy).
 * SUPER_ADMIN can bypass this restriction.
 * 
 * Checks campusId in route params against user's campusId.
 */
@Injectable()
export class CampusAccessGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // User must be authenticated
        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        // SUPER_ADMIN can access all campuses
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }

        // Check if route has campusId parameter
        const campusId = request.params.campusId;

        // If no campusId in params, assume query-level filtering will handle it
        if (!campusId) {
            return true;
        }

        // Verify user belongs to the campus they're trying to access
        if (campusId !== user.campusId) {
            throw new ForbiddenException('Access denied to this campus');
        }

        return true;
    }
}
