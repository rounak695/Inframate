import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * Users Service
 * 
 * Manages user operations within a campus.
 */
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all users in a campus
     */
    async findAll(campusId: string) {
        return this.prisma.user.findMany({
            where: {
                campusId,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                department: true,
                studentId: true,
                phoneNumber: true,
                lastLoginAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get user by ID
     */
    async findOne(id: string, campusId: string) {
        return this.prisma.user.findFirst({
            where: {
                id,
                campusId,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                department: true,
                studentId: true,
                phoneNumber: true,
                emailVerified: true,
                lastLoginAt: true,
                createdAt: true,
                _count: {
                    select: {
                        createdIssues: true,
                        assignedIssues: true,
                    },
                },
            },
        });
    }

    /**
     * Get current user profile
     */
    async getProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                department: true,
                studentId: true,
                phoneNumber: true,
                campusId: true,
                campus: {
                    select: {
                        id: true,
                        name: true,
                        subdomain: true,
                        logoUrl: true,
                    },
                },
            },
        });
    }
}
