import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SlaService } from './sla.service';

/**
 * SLA Module
 * 
 * Provides SLA monitoring with automated breach detection.
 */
@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [SlaService],
    exports: [SlaService],
})
export class SlaModule { }
