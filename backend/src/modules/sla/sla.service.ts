import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { IssueStatus } from '@prisma/client';

/**
 * SLA Service
 * 
 * Monitors SLA breaches and sends escalation notifications.
 * Runs hourly cron jobs to check for breached deadlines.
 */
@Injectable()
export class SlaService {
    private readonly logger = new Logger(SlaService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Hourly SLA Breach Check
     * Runs every hour to detect and handle SLA breaches
     */
    @Cron(CronExpression.EVERY_HOUR)
    async checkSLABreaches() {
        this.logger.log('Starting SLA breach check...');

        const now = new Date();
        let breachCount = 0;

        try {
            // 1. Check Response SLA breaches (SUBMITTED issues)
            const responseBreaches = await this.prisma.issue.findMany({
                where: {
                    status: IssueStatus.SUBMITTED,
                    slaResponseDeadline: { lt: now },
                    slaResponseBreached: false,
                    deletedAt: null,
                },
                include: {
                    creator: true,
                    category: true,
                    campus: true,
                },
            });

            for (const issue of responseBreaches) {
                await this.handleResponseBreach(issue);
                breachCount++;
            }

            // 2. Check Resolution SLA breaches (ASSIGNED/IN_PROGRESS issues)
            const resolutionBreaches = await this.prisma.issue.findMany({
                where: {
                    status: {
                        in: [IssueStatus.ASSIGNED, IssueStatus.IN_PROGRESS],
                    },
                    slaResolutionDeadline: { lt: now },
                    slaResolutionBreached: false,
                    deletedAt: null,
                },
                include: {
                    assignee: true,
                    creator: true,
                    category: true,
                    campus: true,
                },
            });

            for (const issue of resolutionBreaches) {
                await this.handleResolutionBreach(issue);
                breachCount++;
            }

            this.logger.log(
                `SLA breach check completed. Found ${breachCount} breaches.`,
            );
        } catch (error) {
            this.logger.error('Error during SLA breach check:', error);
        }
    }

    /**
     * Handle Response SLA Breach
     * Issue not assigned within response SLA
     */
    private async handleResponseBreach(issue: any) {
        this.logger.warn(
            `Response SLA breach detected for Issue #${issue.issueNumber} (${issue.priority})`,
        );

        // Mark as breached
        await this.prisma.issue.update({
            where: { id: issue.id },
            data: {
                slaResponseBreached: true,
                slaResponseBreachedAt: new Date(),
            },
        });

        // Create audit log
        await this.prisma.auditLog.create({
            data: {
                campusId: issue.campusId,
                userId: null, // System action
                action: 'SLA_RESPONSE_BREACH',
                entityType: 'Issue',
                entityId: issue.id,
                changes: {
                    issueNumber: issue.issueNumber,
                    priority: issue.priority,
                    deadline: issue.slaResponseDeadline,
                    breachedAt: new Date(),
                },
            },
        });

        // TODO: Send notification to campus admins
        // await this.notificationService.sendSLABreach(issue, 'RESPONSE');

        this.logger.log(
            `Response SLA breach handled for Issue #${issue.issueNumber}`,
        );
    }

    /**
     * Handle Resolution SLA Breach
     * Issue not resolved within resolution SLA
     */
    private async handleResolutionBreach(issue: any) {
        this.logger.warn(
            `Resolution SLA breach detected for Issue #${issue.issueNumber} (${issue.priority})`,
        );

        // Mark as breached
        await this.prisma.issue.update({
            where: { id: issue.id },
            data: {
                slaResolutionBreached: true,
                slaResolutionBreachedAt: new Date(),
            },
        });

        // Create audit log
        await this.prisma.auditLog.create({
            data: {
                campusId: issue.campusId,
                userId: issue.assignedTo,
                action: 'SLA_RESOLUTION_BREACH',
                entityType: 'Issue',
                entityId: issue.id,
                changes: {
                    issueNumber: issue.issueNumber,
                    priority: issue.priority,
                    assignedTo: issue.assignedTo,
                    deadline: issue.slaResolutionDeadline,
                    breachedAt: new Date(),
                },
            },
        });

        // TODO: Send notification to assignee and admins
        // await this.notificationService.sendSLABreach(issue, 'RESOLUTION');

        this.logger.log(
            `Resolution SLA breach handled for Issue #${issue.issueNumber}`,
        );
    }

    /**
     * Daily Auto-Close Job
     * Automatically close RESOLVED issues after 48 hours
     */
    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async autoCloseResolvedIssues() {
        this.logger.log('Starting auto-close job for resolved issues...');

        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago

        const resolvedIssues = await this.prisma.issue.findMany({
            where: {
                status: IssueStatus.RESOLVED,
                resolvedAt: { lt: cutoff },
                deletedAt: null,
            },
        });

        let closedCount = 0;

        for (const issue of resolvedIssues) {
            await this.prisma.issue.update({
                where: { id: issue.id },
                data: {
                    status: IssueStatus.CLOSED,
                    verifiedAt: new Date(),
                    closedAt: new Date(),
                },
            });

            // Create audit log
            await this.prisma.auditLog.create({
                data: {
                    campusId: issue.campusId,
                    userId: null,
                    action: 'ISSUE_AUTO_CLOSED',
                    entityType: 'Issue',
                    entityId: issue.id,
                    changes: {
                        from: IssueStatus.RESOLVED,
                        to: IssueStatus.CLOSED,
                        reason: 'Auto-closed after 48 hours',
                    },
                },
            });

            // TODO: Send notification to creator
            // await this.notificationService.sendIssueClosed(issue);

            closedCount++;
        }

        this.logger.log(
            `Auto-close job completed. Closed ${closedCount} issues.`,
        );
    }

    /**
     * Get SLA statistics for a campus
     */
    async getSLAStats(campusId: string) {
        const totalIssues = await this.prisma.issue.count({
            where: { campusId, deletedAt: null },
        });

        const responseBreaches = await this.prisma.issue.count({
            where: { campusId, slaResponseBreached: true, deletedAt: null },
        });

        const resolutionBreaches = await this.prisma.issue.count({
            where: { campusId, slaResolutionBreached: true, deletedAt: null },
        });

        const responseCompliance =
            totalIssues > 0
                ? ((totalIssues - responseBreaches) / totalIssues) * 100
                : 100;

        const resolutionCompliance =
            totalIssues > 0
                ? ((totalIssues - resolutionBreaches) / totalIssues) * 100
                : 100;

        return {
            totalIssues,
            responseBreaches,
            resolutionBreaches,
            responseCompliance: Math.round(responseCompliance * 100) / 100,
            resolutionCompliance: Math.round(resolutionCompliance * 100) / 100,
        };
    }
}
