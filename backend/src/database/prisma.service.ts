import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service
 * 
 * Singleton service for Prisma Client with connection lifecycle management.
 * Implements multi-tenant isolation via middleware.
 */
@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: ['query', 'error', 'warn'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('✅ Database connected successfully');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('👋 Database disconnected');
    }

    /**
     * Enable soft delete filtering
     * Automatically exclude deleted records from queries
     */
    enableSoftDelete() {
        this.$use(async (params, next) => {
            if (params.model === 'Issue' || params.model === 'Comment' || params.model === 'Attachment') {
                if (params.action === 'findUnique' || params.action === 'findFirst') {
                    params.action = 'findFirst';
                    params.args.where['deletedAt'] = null;
                }
                if (params.action === 'findMany') {
                    if (params.args.where) {
                        if (params.args.where.deletedAt === undefined) {
                            params.args.where['deletedAt'] = null;
                        }
                    } else {
                        params.args['where'] = { deletedAt: null };
                    }
                }
            }
            return next(params);
        });
    }
}
