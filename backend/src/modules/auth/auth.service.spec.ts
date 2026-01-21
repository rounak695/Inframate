import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return access token for valid credentials', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'STUDENT',
                campusId: 'campus-1',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.login({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result).toHaveProperty('accessToken', 'mock-jwt-token');
            expect(result.user.email).toBe('test@example.com');
        });

        it('should throw UnauthorizedException for invalid email', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(
                service.login({
                    email: 'invalid@example.com',
                    password: 'password123',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for invalid password', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                password: await bcrypt.hash('correctpassword', 10),
                role: 'STUDENT',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            await expect(
                service.login({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('should create a new user successfully', async () => {
            const registerDto = {
                email: 'newuser@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                campusId: 'campus-1',
                role: 'STUDENT' as any,
            };

            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.user.create.mockResolvedValue({
                id: 'user-2',
                ...registerDto,
                password: 'hashed',
            });
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('accessToken');
            expect(mockPrismaService.user.create).toHaveBeenCalled();
        });

        it('should throw ConflictException for duplicate email', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                campusId: 'campus-1',
                role: 'STUDENT' as any,
            };

            mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });

            await expect(service.register(registerDto)).rejects.toThrow(
                ConflictException,
            );
        });
    });
});
