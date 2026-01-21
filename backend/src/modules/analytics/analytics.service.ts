import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { IssueStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getOverviewStats(campusId: string, days: number = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Total Issues in period
        const totalIssues = await this.prisma.issue.count({
            where: {
                campusId,
                createdAt: { gte: startDate },
                deletedAt: null,
            },
        });

        // Resolved Issues in period
        const resolvedIssues = await this.prisma.issue.count({
            where: {
                campusId,
                status: { in: [IssueStatus.RESOLVED, IssueStatus.VERIFIED, IssueStatus.CLOSED] },
                createdAt: { gte: startDate },
                deletedAt: null,
            },
        });

        // Active Breaches (Current)
        const activeBreaches = await this.prisma.issue.count({
            where: {
                campusId,
                OR: [
                    { slaResponseBreached: true },
                    { slaResolutionBreached: true }
                ],
                status: { notIn: [IssueStatus.RESOLVED, IssueStatus.VERIFIED, IssueStatus.CLOSED] },
                deletedAt: null,
            },
        });

        // Avg Resolution Time (Hours) - Raw SQL for performance
        // Note: We need to cast to appropriate types or handle BigInt if returned
        const avgResolutionResult: any[] = await this.prisma.$queryRaw`
      SELECT AVG(EXTRACT(EPOCH FROM ("resolvedAt" - "createdAt")) / 3600)::float as avg_hours
      FROM issues
      WHERE "campusId" = ${campusId}
      AND "resolvedAt" IS NOT NULL
      AND "createdAt" >= ${startDate}
      AND "deletedAt" IS NULL
    `;

        const avgResolutionTime = avgResolutionResult[0]?.avg_hours || 0;

        return {
            totalIssues,
            resolutionRate: totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0,
            activeBreaches,
            avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        };
    }

    async getResolutionMetrics(campusId: string, days: number = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Issues by Category
        const issuesByCategory: any[] = await this.prisma.$queryRaw`
      SELECT c.name, COUNT(i.id)::int as count
      FROM issues i
      JOIN categories c ON i."categoryId" = c.id
      WHERE i."campusId" = ${campusId}
      AND i."createdAt" >= ${startDate}
      AND i."deletedAt" IS NULL
      GROUP BY c.name
    `;

        // Status Distribution
        const statusDistribution: any[] = await this.prisma.$queryRaw`
      SELECT status, COUNT(id)::int as count
      FROM issues
      WHERE "campusId" = ${campusId}
      AND "createdAt" >= ${startDate}
      AND "deletedAt" IS NULL
      GROUP BY status
    `;

        return {
            byCategory: issuesByCategory,
            byStatus: statusDistribution,
        };
    }

    async getStaffPerformance(campusId: string, days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Top Resolvers
        const staffPerformance: any[] = await this.prisma.$queryRaw`
      SELECT 
        u."firstName", 
        u."lastName", 
        COUNT(i.id)::int as resolved_count,
        AVG(EXTRACT(EPOCH FROM (i."resolvedAt" - i."createdAt")) / 3600)::float as avg_resolution_hours
      FROM issues i
      JOIN users u ON i."assignedTo" = u.id
      WHERE i."campusId" = ${campusId}
      AND i."status" IN ('RESOLVED', 'VERIFIED', 'CLOSED')
      AND i."resolvedAt" >= ${startDate}
      AND i."deletedAt" IS NULL
      GROUP BY u.id, u."firstName", u."lastName"
      ORDER BY resolved_count DESC
      LIMIT 5
    `;

        return staffPerformance;
    }
}
