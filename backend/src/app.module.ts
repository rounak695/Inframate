import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CampusModule } from './modules/campus/campus.module';
import { IssuesModule } from './modules/issues/issues.module';
import { SlaModule } from './modules/sla/sla.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * App Module
 * 
 * Root module that orchestrates the entire application.
 * Configures global modules, filters, and guards.
 */
@Module({
    imports: [
        // Global configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate limiting (anti-abuse)
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 60 seconds
                limit: 100, // 100 requests per minute
            },
        ]),

        // Global database module
        PrismaModule,

        // Feature modules
        AuthModule,
        UsersModule,
        CampusModule,
        IssuesModule,
        SlaModule,
    ],
    providers: [
        // Global exception filter
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        // Global rate limiting
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
