import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * Campus Service
 * 
 * Manages campus (tenant) operations.
 */
@Injectable()
export class CampusService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all campuses (SUPER_ADMIN only)
     */
    async findAll() {
        return this.prisma.campus.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                subdomain: true,
                logoUrl: true,
                subscriptionTier: true,
                createdAt: true,
                _count: {
                    select: {
                        users: true,
                        issues: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get campus by ID
     */
    async findOne(id: string) {
        return this.prisma.campus.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        issues: true,
                        categories: true,
                    },
                },
            },
        });
    }
}
