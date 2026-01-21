import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

/**
 * Bootstrap Application
 * 
 * Initialize and configure the NestJS application.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Get configuration service
    const configService = app.get(ConfigService);

    // Security: Helmet middleware for security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        hsts: {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true,
        },
    }));

    // Security: Trust proxy for proper IP detection behind reverse proxies
    (app as any).set('trust proxy', 1);

    // Enable global validation with strict mode
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip unknown properties
            forbidNonWhitelisted: true, // Throw error on unknown properties
            transform: true, // Auto-transform payloads to DTO instances
            transformOptions: {
                enableImplicitConversion: false, // Explicit type conversion only
            },
        }),
    );

    // Enable CORS with strict origins
    const corsOrigin = configService.get('CORS_ORIGIN');
    const nodeEnv = configService.get('NODE_ENV');

    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://inframate-frontend.vercel.app',
        corsOrigin,
    ].filter((origin) => origin);

    app.enableCors({
        origin: nodeEnv === 'production'
            ? allowedOrigins.filter(o => !o.includes('localhost'))
            : allowedOrigins,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization',
    });

    // Set global API prefix
    const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
    app.setGlobalPrefix(apiPrefix);

    // Setup Swagger/OpenAPI Documentation
    const enableSwagger = configService.get('ENABLE_SWAGGER') === 'true' || nodeEnv !== 'production';
    if (enableSwagger) {
        const config = new DocumentBuilder()
            .setTitle('Inframate API')
            .setDescription('Multi-tenant campus infrastructure management system')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('Authentication', 'User authentication and authorization')
            .addTag('Issues', 'Issue management')
            .addTag('Users', 'User management')
            .addTag('Categories', 'Category management')
            .addTag('Analytics', 'Analytics and reporting')
            .addTag('Audit', 'Audit logging')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document, {
            customSiteTitle: 'Inframate API Docs',
        });
    }

    // Start server
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0'); // Bind to 0.0.0.0 for Render

    console.log(`\n🚀 Inframate Backend Server Started`);
    console.log(`📡 Backend API: http://localhost:${port}/${apiPrefix}`);
    console.log(`🔐 Environment: ${nodeEnv}`);
    console.log(`🛡️  Security: Helmet enabled`);
    console.log(`📊 Database: Connected`);
    console.log(`⏰ SLA Cron: Active (hourly checks)`);
    if (enableSwagger) {
        console.log(`📚 Swagger UI: http://localhost:${port}/api/docs`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

bootstrap();
