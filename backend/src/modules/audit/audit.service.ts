import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface AuditLogEntry {
    userId?: string;
    campusId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: any;
    ipAddress?: string;
    userAgent?: string;
}

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    /**
     * Log an action to the audit trail
     */
    async log(entry: AuditLogEntry) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: entry.userId,
                    campusId: entry.campusId,
                    action: entry.action,
                    entityType: entry.entityType,
                    entityId: entry.entityId,
                    changes: entry.changes,
                    ipAddress: entry.ipAddress,
                    userAgent: entry.userAgent,
                },
            });
        } catch (error) {
            // Log error but don't fail the main operation
            console.error('Failed to create audit log:', error);
        }
    }

    /**
     * Get audit logs with filters and pagination
     */
    async getAll(
        campusId: string,
        filters: {
            action?: string;
            entityType?: string;
            userId?: string;
            startDate?: Date;
            endDate?: Date;
        } = {},
        pagination: { page: number; limit: number } = { page: 1, limit: 50 },
    ) {
        const { action, entityType, userId, startDate, endDate } = filters;
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const where: any = { campusId };

        if (action) where.action = action;
        if (entityType) where.entityType = entityType;
        if (userId) where.userId = userId;
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp.gte = startDate;
            if (endDate) where.timestamp.lte = endDate;
        }

        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: { timestamp: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);

        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
