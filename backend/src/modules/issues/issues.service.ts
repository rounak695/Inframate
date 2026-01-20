import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { AssignIssueDto } from './dto/assign-issue.dto';
import { IssueStatus } from '@prisma/client';

/**
 * Issues Service
 * 
 * Core business logic for issue lifecycle management and SLA calculations.
 */
@Injectable()
export class IssuesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create new issue with SLA calculation
     */
    async create(dto: CreateIssueDto, userId: string, campusId: string) {
        // Fetch category to get SLA configuration
        const category = await this.prisma.category.findUnique({
            where: { id: dto.categoryId },
        });

        if (!category) {
            throw new BadRequestException('Invalid category ID');
        }

        // Verify category belongs to same campus
        if (category.campusId !== campusId) {
            throw new ForbiddenException('Category does not belong to your campus');
        }

        // Calculate SLA deadlines based on priority
        const slaConfig = category.slaConfig as any;
        const prioritySLA = slaConfig[dto.priority];

        if (!prioritySLA) {
            throw new BadRequestException(`No SLA configuration for priority ${dto.priority}`);
        }

        const now = new Date();
        const responseDeadline = new Date(
            now.getTime() + prioritySLA.responseMinutes * 60 * 1000,
        );
        const resolutionDeadline = new Date(
            now.getTime() + prioritySLA.resolutionHours * 60 * 60 * 1000,
        );

        // Get next issue number for this campus
        const lastIssue = await this.prisma.issue.findFirst({
            where: { campusId },
            orderBy: { issueNumber: 'desc' },
            select: { issueNumber: true },
        });

        const issueNumber = (lastIssue?.issueNumber || 0) + 1;

        // Create issue
        const issue = await this.prisma.issue.create({
            data: {
                campusId,
                issueNumber,
                createdBy: userId,
                categoryId: dto.categoryId,
                title: dto.title,
                description: dto.description,
                priority: dto.priority,
                location: dto.location,
                status: IssueStatus.SUBMITTED,
                slaResponseDeadline: responseDeadline,
                slaResolutionDeadline: resolutionDeadline,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        return issue;
    }

    /**
     * Get all issues for a campus with filtering
     */
    async findAll(campusId: string, filters?: any) {
        const where: any = {
            campusId,
            deletedAt: null,
        };

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.priority) {
            where.priority = filters.priority;
        }

        if (filters?.assignedTo) {
            where.assignedTo = filters.assignedTo;
        }

        const issues = await this.prisma.issue.findMany({
            where,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return issues;
    }

    /**
     * Get single issue by ID
     */
    async findOne(id: string, campusId: string, role: string, userId: string) {
        const issue = await this.prisma.issue.findFirst({
            where: {
                id,
                campusId,
                deletedAt: null,
            },
            include: {
                category: true,
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                comments: {
                    where: { deletedAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
                assignments: {
                    include: {
                        assignedUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        assignedByUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { assignedAt: 'desc' },
                },
            },
        });

        if (!issue) {
            throw new NotFoundException('Issue not found');
        }

        // Students can only view their own issues
        if (role === 'STUDENT' && issue.createdBy !== userId) {
            throw new ForbiddenException('You can only view your own issues');
        }

        return issue;
    }

    /**
     * Assign issue to staff member
     */
    async assign(id: string, dto: AssignIssueDto, assignedById: string, campusId: string) {
        const issue = await this.prisma.issue.findFirst({
            where: { id, campusId, deletedAt: null },
        });

        if (!issue) {
            throw new NotFoundException('Issue not found');
        }

        // Verify assignee is STAFF or ADMIN
        const assignee = await this.prisma.user.findUnique({
            where: { id: dto.assignedTo },
        });

        if (!assignee || assignee.campusId !== campusId) {
            throw new BadRequestException('Invalid assignee');
        }

        if (!['STAFF', 'ADMIN'].includes(assignee.role)) {
            throw new BadRequestException('Can only assign to STAFF or ADMIN users');
        }

        // Create assignment record
        await this.prisma.assignment.create({
            data: {
                issueId: id,
                assignedTo: dto.assignedTo,
                assignedBy: assignedById,
                notes: dto.notes,
            },
        });

        // Update issue
        const updated = await this.prisma.issue.update({
            where: { id },
            data: {
                assignedTo: dto.assignedTo,
                status: IssueStatus.ASSIGNED,
                assignedAt: new Date(),
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        return updated;
    }

    /**
     * Update issue status
     */
    async updateStatus(
        id: string,
        status: IssueStatus,
        campusId: string,
        userId: string,
        role: string,
        resolutionNotes?: string,
    ) {
        const issue = await this.prisma.issue.findFirst({
            where: { id, campusId, deletedAt: null },
        });

        if (!issue) {
            throw new NotFoundException('Issue not found');
        }

        // Validate state transition
        this.validateStatusTransition(issue.status, status, role, issue.assignedTo, userId);

        const updateData: any = { status };

        // Handle status-specific updates
        if (status === IssueStatus.IN_PROGRESS) {
            updateData.firstResponseAt = issue.firstResponseAt || new Date();
        }

        if (status === IssueStatus.RESOLVED) {
            if (!resolutionNotes) {
                throw new BadRequestException('Resolution notes required');
            }
            updateData.resolvedAt = new Date();
            updateData.resolutionNotes = resolutionNotes;
        }

        if (status === IssueStatus.VERIFIED) {
            updateData.verifiedAt = new Date();
        }

        if (status === IssueStatus.CLOSED) {
            updateData.closedAt = new Date();
        }

        const updated = await this.prisma.issue.update({
            where: { id },
            data: updateData,
        });

        return updated;
    }

    /**
     * Validate status transitions according to state machine
     */
    private validateStatusTransition(
        currentStatus: IssueStatus,
        newStatus: IssueStatus,
        role: string,
        assignedTo: string | null,
        userId: string,
    ) {
        const validTransitions: Record<IssueStatus, IssueStatus[]> = {
            SUBMITTED: [IssueStatus.ASSIGNED, IssueStatus.CLOSED],
            ASSIGNED: [IssueStatus.IN_PROGRESS, IssueStatus.SUBMITTED],
            IN_PROGRESS: [IssueStatus.RESOLVED, IssueStatus.ASSIGNED],
            RESOLVED: [IssueStatus.VERIFIED, IssueStatus.IN_PROGRESS],
            VERIFIED: [IssueStatus.CLOSED],
            CLOSED: [], // Terminal state
        };

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            throw new BadRequestException(
                `Invalid status transition from ${currentStatus} to ${newStatus}`,
            );
        }

        // Role-based transition permissions
        if (newStatus === IssueStatus.IN_PROGRESS || newStatus === IssueStatus.RESOLVED) {
            if (role !== 'ADMIN' && assignedTo !== userId) {
                throw new ForbiddenException('Only assignee can change to this status');
            }
        }
    }

    /**
     * Get my assigned issues
     */
    async getMyAssignedIssues(userId: string) {
        return this.prisma.issue.findMany({
            where: {
                assignedTo: userId,
                status: {
                    in: [IssueStatus.ASSIGNED, IssueStatus.IN_PROGRESS],
                },
                deletedAt: null,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                slaResolutionDeadline: 'asc',
            },
        });
    }

    /**
     * Get my created issues
     */
    async getMyCreatedIssues(userId: string) {
        return this.prisma.issue.findMany({
            where: {
                createdBy: userId,
                deletedAt: null,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
