import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract current authenticated user from request
 * 
 * Usage:
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user; // Attached by JwtStrategy
    },
);

/**
 * Extract campusId from current user
 * 
 * Usage:
 * @Get('issues')
 * getIssues(@CampusId() campusId: string) {
 *   return this.issuesService.findAll(campusId);
 * }
 */
export const CampusId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user?.campusId;
    },
);

/**
 * Extract userId from current user
 * 
 * Usage:
 * @Post('issues')
 * createIssue(@UserId() userId: string, @Body() dto: CreateIssueDto) {
 *   return this.issuesService.create(dto, userId);
 * }
 */
export const UserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user?.id;
    },
);
