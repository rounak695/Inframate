import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MetricsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get active users count for different time periods
     */
    async getActiveUsers() {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Daily active users (last 24 hours)
        const dau = await this.prisma.user.count({
            where: {
                lastLoginAt: {
                    gte: yesterday,
                },
            },
        });

        // Weekly active users
        const wau = await this.prisma.user.count({
            where: {
                lastLoginAt: {
                    gte: weekAgo,
                },
            },
        });

        // Monthly active users
        const mau = await this.prisma.user.count({
            where: {
                lastLoginAt: {
                    gte: monthAgo,
                },
            },
        });

        // Breakdown by role
        const byRole = await this.prisma.user.groupBy({
            by: ['role'],
            where: {
                lastLoginAt: {
                    gte: monthAgo,
                },
            },
            _count: {
                id: true,
            },
        });

        const roleBreakdown = byRole.reduce((acc, item) => {
            acc[item.role] = item._count.id;
            return acc;
        }, {} as Record<string, number>);

        return {
            daily: dau,
            weekly: wau,
            monthly: mau,
            byRole: roleBreakdown,
        };
    }

    /**
     * Get issue creation metrics
     */
    async getIssueMetrics(days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const total = await this.prisma.issue.count();

        const recentIssues = await this.prisma.issue.count({
            where: {
                createdAt: {
                    gte: startDate,
                },
            },
        });

        // By category
        const byCategory = await this.prisma.issue.groupBy({
            by: ['categoryId'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 5,
        });

        // By priority
        const byPriority = await this.prisma.issue.groupBy({
            by: ['priority'],
            _count: {
                id: true,
            },
        });

        return {
            total,
            recentCount: recentIssues,
            period: `${days} days`,
            byCategory: await Promise.all(
                byCategory.map(async (item) => {
                    const category = await this.prisma.category.findUnique({
                        where: { id: item.categoryId },
                        select: { name: true },
                    });
                    return {
                        category: category?.name || 'Unknown',
                        count: item._count.id,
                    };
                }),
            ),
            byPriority: byPriority.reduce((acc, item) => {
                acc[item.priority] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
        };
    }

    /**
     * Get resolution metrics
     */
    async getResolutionMetrics() {
        const totalIssues = await this.prisma.issue.count();
        const resolvedIssues = await this.prisma.issue.count({
            where: { status: 'RESOLVED' },
        });

        const resolutionRate = totalIssues > 0 ? resolvedIssues / totalIssues : 0;

        // Average resolution time (in hours)
        const resolvedWithTime = await this.prisma.issue.findMany({
            where: {
                status: 'RESOLVED',
                resolvedAt: {
                    not: null,
                },
            },
            select: {
                createdAt: true,
                resolvedAt: true,
            },
        });

        let avgResolutionHours = 0;
        if (resolvedWithTime.length > 0) {
            const totalHours = resolvedWithTime.reduce((sum, issue) => {
                if (issue.resolvedAt) {
                    const hours = (issue.resolvedAt.getTime() - issue.createdAt.getTime()) / (1000 * 60 * 60);
                    return sum + hours;
                }
                return sum;
            }, 0);
            avgResolutionHours = totalHours / resolvedWithTime.length;
        }

        // SLA compliance
        const totalWithSLA = await this.prisma.issue.count({
            where: {
                status: 'RESOLVED',
            },
        });
        const slaCompliant = await this.prisma.issue.count({
            where: {
                status: 'RESOLVED',
                slaBreached: false,
            },
        });

        const slaCompliance = totalWithSLA > 0 ? slaCompliant / totalWithSLA : 0;

        return {
            resolutionRate,
            avgResolutionHours: Math.round(avgResolutionHours * 10) / 10, // Round to 1 decimal
            slaCompliance,
            totalIssues,
            resolvedIssues,
        };
    }

    /**
     * Get comprehensive usage snapshot
     */
    async getUsageSnapshot(days: number = 30) {
        const [activeUsers, issueMetrics, resolutionMetrics] = await Promise.all([
            this.getActiveUsers(),
            this.getIssueMetrics(days),
            this.getResolutionMetrics(),
        ]);

        return {
            activeUsers,
            issues: issueMetrics,
            resolution: resolutionMetrics,
            generatedAt: new Date().toISOString(),
        };
    }
}
