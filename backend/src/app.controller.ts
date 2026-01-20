import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    /**
     * Health Check Endpoint
     * 
     * Used by Render and other monitoring tools to check if the server is up.
     * Returns 200 OK with status.
     */
    @Get('health')
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'inframate-backend'
        };
    }

    /**
     * Root Endpoint
     * 
     * Basic check to verify API prefix is working (or not).
     */
    @Get()
    getRoot() {
        return {
            message: 'Inframate API is running',
            documentation: '/api/v1/docs (if enabled)'
        };
    }
}
