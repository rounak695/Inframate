import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';

/**
 * Issues Module
 * 
 * Provides issue management functionality with SLA tracking.
 */
@Module({
    controllers: [IssuesController],
    providers: [IssuesService],
    exports: [IssuesService],
})
export class IssuesModule { }
