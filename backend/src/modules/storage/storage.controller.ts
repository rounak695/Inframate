import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Post('upload-url')
    async getUploadUrl(
        @CurrentUser() user: any,
        @Body() body: { filename: string; contentType: string },
    ) {
        // Optional: Add logic to restrict file types or sizes if needed

        return this.storageService.getUploadUrl(body.filename, body.contentType);
    }
}
