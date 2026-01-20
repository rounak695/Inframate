import { Role } from '@prisma/client';

/**
 * Extended Request interface with authenticated user
 */
export interface RequestWithUser extends Request {
    user: {
        id: string;
        campusId: string;
        email: string;
        role: Role;
        firstName: string;
        lastName: string;
    };
}
