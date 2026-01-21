import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../notifications/email.service';
import { InviteUserDto } from './dto/invite-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) { }

    /**
     * Generate a secure random invitation token
     */
    private generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Invite a single user (staff or student)
     */
    async inviteUser(inviteDto: InviteUserDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: inviteDto.email },
        });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // Generate invitation token
        const token = this.generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        // Create invitation record
        const invitation = await this.prisma.invitation.create({
            data: {
                email: inviteDto.email,
                firstName: inviteDto.firstName,
                lastName: inviteDto.lastName,
                role: inviteDto.role,
                campusId: inviteDto.campusId,
                department: inviteDto.department,
                token,
                expiresAt,
            },
        });

        // Send invitation email
        const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/invite/${token}`;

        await this.emailService.sendEmail(
            inviteDto.email,
            'Invitation to Join Inframate',
            `Hi ${inviteDto.firstName},\n\nYou've been invited to join Inframate as a ${inviteDto.role}.\n\nClick here to complete your registration: ${invitationLink}\n\nThis link expires in 7 days.\n\nBest regards,\nInframate Team`,
        );

        return {
            message: 'Invitation sent successfully',
            invitationId: invitation.id,
            email: invitation.email,
        };
    }

    /**
     * Validate invitation token
     */
    async validateToken(token: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
        });

        if (!invitation) {
            throw new NotFoundException('Invalid invitation token');
        }

        if (invitation.acceptedAt) {
            throw new BadRequestException('Invitation already accepted');
        }

        if (new Date() > invitation.expiresAt) {
            throw new BadRequestException('Invitation has expired');
        }

        return invitation;
    }

    /**
     * Accept invitation and create user
     */
    async acceptInvitation(token: string, password: string) {
        const invitation = await this.validateToken(token);

        // Create user account
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: invitation.email,
                password: hashedPassword,
                firstName: invitation.firstName,
                lastName: invitation.lastName,
                role: invitation.role,
                campusId: invitation.campusId,
                department: invitation.department,
            },
        });

        // Mark invitation as accepted
        await this.prisma.invitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() },
        });

        return {
            message: 'Account created successfully',
            userId: user.id,
        };
    }
}
