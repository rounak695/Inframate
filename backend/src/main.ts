import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

/**
 * Bootstrap Application
 * 
 * Initialize and configure the NestJS application.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Get configuration service
    const configService = app.get(ConfigService);

    // Enable global validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip unknown properties
            forbidNonWhitelisted: true, // Throw error on unknown properties
            transform: true, // Auto-transform payloads to DTO instances
        }),
    );

    // Enable CORS
    const corsOrigin = configService.get('CORS_ORIGIN');
    console.log(`🔧 CORS Configured Origin: ${corsOrigin}`);

    app.enableCors({
        origin: corsOrigin || 'http://localhost:3001',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    // Set global API prefix
    const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
    app.setGlobalPrefix(apiPrefix);

    // Start server
    const port = configService.get('PORT') || 3000;
    await app.listen(port);

    console.log('');
    console.log('🚀 Inframate Backend Server Started');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server running on: http://localhost:${port}/${apiPrefix}`);
    console.log(`🔐 Environment: ${configService.get('NODE_ENV')}`);
    console.log(`📊 Database: Connected`);
    console.log(`⏰ SLA Cron: Active (hourly checks)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

bootstrap();
