import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Authentication Service
 * 
 * Handles user authentication, registration, and JWT token management.
 */
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    /**
     * User Login
     * Validates credentials and returns access token
     */
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                campus: {
                    select: {
                        id: true,
                        name: true,
                        subdomain: true,
                        isActive: true,
                    },
                },
            },
        });

        // Verify user exists
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Verify user is active
        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Verify campus is active
        if (!user.campus.isActive) {
            throw new UnauthorizedException('Campus is deactivated');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Update last login timestamp
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate access token
        const accessToken = this.generateAccessToken(user);

        // Return token and user info
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                campusId: user.campusId,
                campus: {
                    id: user.campus.id,
                    name: user.campus.name,
                    subdomain: user.campus.subdomain,
                },
            },
        };
    }

    /**
     * User Registration
     * Creates new user account with hashed password
     */
    async register(registerDto: RegisterDto) {
        const { email, password, campusId, ...userData } = registerDto;

        // Check if email already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Verify campus exists and is active
        const campus = await this.prisma.campus.findUnique({
            where: { id: campusId },
        });

        if (!campus) {
            throw new BadRequestException('Invalid campus ID');
        }

        if (!campus.isActive) {
            throw new BadRequestException('Campus is not active');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                campusId,
                ...userData,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                campusId: true,
            },
        });

        // Generate access token
        const accessToken = this.generateAccessToken(user);

        return {
            accessToken,
            user,
        };
    }

    /**
     * Generate JWT Access Token
     * Short-lived token (15 minutes)
     */
    private generateAccessToken(user: any): string {
        const payload = {
            sub: user.id,
            email: user.email,
            campusId: user.campusId,
            role: user.role,
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
        });
    }

    /**
     * Validate user by email (used by LocalStrategy if needed)
     */
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (isPasswordValid) {
            const { passwordHash, ...result } = user;
            return result;
        }

        return null;
    }
}
