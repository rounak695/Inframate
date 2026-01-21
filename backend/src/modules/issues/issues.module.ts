import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';

/**
 * Issues Module
 * 
 * Provides issue management functionality with SLA tracking.
 */
@Module({
    imports: [NotificationsModule, AuditModule],
    controllers: [IssuesController],
    providers: [IssuesService],
    exports: [IssuesService],
})
export class IssuesModule { }
