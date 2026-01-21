import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { AssignIssueDto } from './dto/assign-issue.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CampusAccessGuard } from '../../common/guards/campus-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, CampusId, UserId } from '../../common/decorators/user.decorator';

/**
 * Issues Controller
 * 
 * Handles HTTP requests for issue management.
 * All routes protected by JWT authentication and RBAC.
 */
@ApiTags('Issues')
@ApiBearerAuth()
@Controller('issues')
@UseGuards(JwtAuthGuard, RolesGuard, CampusAccessGuard)
export class IssuesController {
    constructor(private readonly issuesService: IssuesService) { }

    /**
     * POST /issues
     * Create new issue (any authenticated user)
     */
    @ApiOperation({ summary: 'Create issue', description: 'Create a new infrastructure issue' })
    @ApiResponse({ status: 201, description: 'Issue created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiBody({ type: CreateIssueDto })
    @Post()
    @Roles('STUDENT', 'STAFF', 'ADMIN')
    create(
        @Body() createIssueDto: CreateIssueDto,
        @UserId() userId: string,
        @CampusId() campusId: string,
    ) {
        return this.issuesService.create(createIssueDto, userId, campusId);
    }

    /**
     * GET /issues
     * Get all campus issues (STAFF and ADMIN only)
     */
    @Get()
    @Roles('STAFF', 'ADMIN')
    findAll(@CampusId() campusId: string, @Query() query: any) {
        return this.issuesService.findAll(campusId, query);
    }

    /**
     * GET /issues/my-assigned
     * Get issues assigned to me
     */
    @Get('my-assigned')
    @Roles('STAFF', 'ADMIN')
    getMyAssigned(@UserId() userId: string) {
        return this.issuesService.getMyAssignedIssues(userId);
    }

    /**
     * GET /issues/my-created
     * Get issues I created
     */
    @Get('my-created')
    @Roles('STUDENT', 'STAFF', 'ADMIN')
    getMyCreated(@UserId() userId: string) {
        return this.issuesService.getMyCreatedIssues(userId);
    }

    /**
     * GET /issues/:id
     * Get single issue by ID
     */
    @Get(':id')
    @Roles('STUDENT', 'STAFF', 'ADMIN')
    findOne(
        @Param('id') id: string,
        @CampusId() campusId: string,
        @CurrentUser() user: any,
    ) {
        return this.issuesService.findOne(id, campusId, user.role, user.id);
    }

    /**
     * PATCH /issues/:id/assign
     * Assign issue to staff member
     */
    @Patch(':id/assign')
    @Roles('STAFF', 'ADMIN')
    assign(
        @Param('id') id: string,
        @Body() assignIssueDto: AssignIssueDto,
        @UserId() userId: string,
        @CampusId() campusId: string,
    ) {
        return this.issuesService.assign(id, assignIssueDto, userId, campusId);
    }

    /**
     * PATCH /issues/:id/status
     * Update issue status
     */
    @Patch(':id/status')
    @Roles('STUDENT', 'STAFF', 'ADMIN')
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateIssueDto,
        @CampusId() campusId: string,
        @UserId() userId: string,
        @CurrentUser() user: any,
    ) {
        return this.issuesService.updateStatus(
            id,
            dto.status!,
            campusId,
            userId,
            user.role,
            dto.resolutionNotes,
        );
    }
}
