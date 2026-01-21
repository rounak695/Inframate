import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);
    private enabled = false;

    constructor() {
        const host = process.env.SMTP_HOST;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false, // true for 465, false for other ports
                auth: {
                    user,
                    pass,
                },
            });
            this.enabled = true;
            this.logger.log('EmailService initialized with SMTP');
        } else {
            this.logger.warn('SMTP credentials missing. Email sending disabled (Mock Mode).');
        }
    }

    async sendEmail(to: string, subject: string, html: string) {
        if (!this.enabled) {
            this.logger.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Inframate Notifications" <noreply@inframate.app>',
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
        }
    }
}
