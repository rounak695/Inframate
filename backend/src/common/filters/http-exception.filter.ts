import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Global HTTP Exception Filter
 * 
 * Standardizes error responses across the application.
 * Logs errors and returns consistent JSON structure.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = (exceptionResponse as any).message || message;
                code = (exceptionResponse as any).error || exception.name;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        // Log error for debugging (in production, use proper logging service)
        console.error(`[${new Date().toISOString()}] ${request.method} ${request.url}`, {
            status,
            message,
            stack: exception instanceof Error ? exception.stack : undefined,
        });

        // Send standardized error response
        response.status(status).json({
            error: {
                code,
                message,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        });
    }
}
