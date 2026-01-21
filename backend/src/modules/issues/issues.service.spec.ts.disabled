import { Test, TestingModule } from '@nestjs/testing';
import { IssuesService } from './issues.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';
import { ForbiddenException } from '@nestjs/common';

describe('IssuesService', () => {
    let service: IssuesService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        issue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockNotificationsService = {
        createNotification: jest.fn(),
    };

    const mockAuditService = {
        log: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IssuesService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: NotificationsService, useValue: mockNotificationsService },
                { provide: AuditService, useValue: mockAuditService },
            ],
        }).compile();

        service = module.get<IssuesService>(IssuesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new issue', async () => {
            const createDto = {
                title: 'Broken projector',
                description: 'Projector not working',
                categoryId: 'cat-1',
                priority: 'HIGH' as any,
            };

            const mockIssue = {
                id: 'issue-1',
                ...createDto,
                createdById: 'user-1',
                campusId: 'campus-1',
            };

            mockPrismaService.issue.create.mockResolvedValue(mockIssue);

            const result = await service.create(createDto, 'user-1', 'campus-1');

            expect(result).toEqual(mockIssue);
            expect(mockPrismaService.issue.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        title: createDto.title,
                        createdById: 'user-1',
                        campusId: 'campus-1',
                    }),
                }),
            );
        });
    });

    describe('assign', () => {
        it('should assign issue to staff member', async () => {
            const mockIssue = {
                id: 'issue-1',
                title: 'Test issue',
                assignedToId: null,
                campusId: 'campus-1',
            };

            const updatedIssue = {
                ...mockIssue,
                assignedToId: 'staff-1',
                assignedTo: { id: 'staff-1', email: 'staff@test.com' },
            };

            mockPrismaService.issue.findUnique.mockResolvedValue(mockIssue);
            mockPrismaService.issue.update.mockResolvedValue(updatedIssue);

            const result = await service.assign(
                'issue-1',
                { staffId: 'staff-1' },
                'campus-1',
            );

            expect(result.assignedToId).toBe('staff-1');
            expect(mockNotificationsService.createNotification).toHaveBeenCalled();
        });

        it('should throw ForbiddenException for cross-campus access', async () => {
            const mockIssue = {
                id: 'issue-1',
                campusId: 'campus-1',
            };

            mockPrismaService.issue.findUnique.mockResolvedValue(mockIssue);

            await expect(
                service.assign('issue-1', { staffId: 'staff-1' }, 'campus-2'),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('updateStatus', () => {
        it('should update issue status', async () => {
            const mockIssue = {
                id: 'issue-1',
                status: 'OPEN',
                campusId: 'campus-1',
                createdById: 'user-1',
                createdBy: { id: 'user-1', email: 'user@test.com' },
            };

            const updatedIssue = {
                ...mockIssue,
                status: 'RESOLVED',
            };

            mockPrismaService.issue.findUnique.mockResolvedValue(mockIssue);
            mockPrismaService.issue.update.mockResolvedValue(updatedIssue);

            const result = await service.updateStatus(
                'issue-1',
                { status: 'RESOLVED' as any },
                'campus-1',
            );

            expect(result.status).toBe('RESOLVED');
            expect(mockAuditService.log).toHaveBeenCalled();
        });
    });
});
