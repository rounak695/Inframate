import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';

/**
 * JWT Strategy
 * 
 * Validates JWT tokens and loads user from database.
 * Attaches user object to request for use in guards and controllers.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    /**
     * Validate JWT payload and load user
     * Called automatically by Passport after token verification
     */
    async validate(payload: any) {
        // Payload structure: { sub: userId, email, campusId, role, iat, exp }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                campusId: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                isActive: true,
            },
        });

        // Verify user exists and is active
        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }

        // This object will be attached to request.user
        return {
            id: user.id,
            campusId: user.campusId,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
}
