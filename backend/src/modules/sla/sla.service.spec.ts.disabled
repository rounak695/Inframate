import { Test, TestingModule } from '@nestjs/testing';
import { SLAService } from './sla.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SLAService', () => {
    let service: SLAService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        issue: {
            findMany: jest.fn(),
            update: jest.fn(),
        },
        category: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SLAService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<SLAService>(SLAService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('calculateSLADeadline', () => {
        it('should calculate correct deadline for HIGH priority', () => {
            const createdAt = new Date('2024-01-01T10:00:00Z');
            const slaHours = 24;

            const deadline = service.calculateSLADeadline(createdAt, slaHours);

            expect(deadline.getTime()).toBe(
                new Date('2024-01-02T10:00:00Z').getTime(),
            );
        });

        it('should calculate correct deadline for LOW priority', () => {
            const createdAt = new Date('2024-01-01T10:00:00Z');
            const slaHours = 168; // 7 days

            const deadline = service.calculateSLADeadline(createdAt, slaHours);

            expect(deadline.getTime()).toBe(
                new Date('2024-01-08T10:00:00Z').getTime(),
            );
        });
    });

    describe('checkAndUpdateSLA', () => {
        it('should mark overdue issues as breached', async () => {
            const now = new Date();
            const pastDeadline = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago

            const mockIssues = [
                {
                    id: 'issue-1',
                    status: 'OPEN',
                    slaDeadline: pastDeadline,
                    slaBreached: false,
                },
            ];

            mockPrismaService.issue.findMany.mockResolvedValue(mockIssues);
            mockPrismaService.issue.update.mockResolvedValue({
                ...mockIssues[0],
                slaBreached: true,
            });

            await service.checkAndUpdateSLA();

            expect(mockPrismaService.issue.update).toHaveBeenCalledWith({
                where: { id: 'issue-1' },
                data: { slaBreached: true },
            });
        });

        it('should not update issues still within SLA', async () => {
            const now = new Date();
            const futureDeadline = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour from now

            const mockIssues = [
                {
                    id: 'issue-1',
                    status: 'OPEN',
                    slaDeadline: futureDeadline,
                    slaBreached: false,
                },
            ];

            mockPrismaService.issue.findMany.mockResolvedValue(mockIssues);

            await service.checkAndUpdateSLA();

            expect(mockPrismaService.issue.update).not.toHaveBeenCalled();
        });

        it('should skip resolved issues', async () => {
            const mockIssues = [
                {
                    id: 'issue-1',
                    status: 'RESOLVED',
                    slaDeadline: new Date(),
                    slaBreached: false,
                },
            ];

            mockPrismaService.issue.findMany.mockResolvedValue(mockIssues);

            await service.checkAndUpdateSLA();

            expect(mockPrismaService.issue.update).not.toHaveBeenCalled();
        });
    });
});
