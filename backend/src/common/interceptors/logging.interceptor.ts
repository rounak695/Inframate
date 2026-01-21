import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging Interceptor with Sensitive Data Masking
 * 
 * Masks sensitive fields in logs to prevent credential leaks
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private sensitiveFields = [
        'password',
        'passwordHash',
        'token',
        'accessToken',
        'refreshToken',
        'secret',
        'apiKey',
    ];

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;

        const maskedBody = this.maskSensitiveData(body);

        // Log request (with masked data)
        console.log(`[${method}] ${url}`, maskedBody ? { body: maskedBody } : '');

        const now = Date.now();
        return next.handle().pipe(
            tap(() => {
                const responseTime = Date.now() - now;
                console.log(`[${method}] ${url} - ${responseTime}ms`);
            }),
        );
    }

    private maskSensitiveData(data: any): any {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.maskSensitiveData(item));
        }

        const masked = { ...data };
        for (const key of Object.keys(masked)) {
            if (this.sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                masked[key] = '***MASKED***';
            } else if (key === 'email') {
                // Partially mask email
                masked[key] = this.maskEmail(masked[key]);
            } else if (typeof masked[key] === 'object') {
                masked[key] = this.maskSensitiveData(masked[key]);
            }
        }
        return masked;
    }

    private maskEmail(email: string): string {
        if (!email || typeof email !== 'string') return email;
        const [local, domain] = email.split('@');
        if (!local || !domain) return email;
        const maskedLocal = local.length > 2
            ? `${local[0]}***${local[local.length - 1]}`
            : '***';
        return `${maskedLocal}@${domain}`;
    }
}
