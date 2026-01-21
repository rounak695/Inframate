import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
    private s3Client: S3Client;
    private readonly logger = new Logger(StorageService.name);
    private bucketName: string;

    constructor() {
        this.bucketName = process.env.R2_BUCKET_NAME || 'inframate-uploads';

        // Check if R2/S3 credentials exist
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const endpoint = process.env.R2_ENDPOINT;

        if (accessKeyId && secretAccessKey && endpoint) {
            this.s3Client = new S3Client({
                region: 'auto',
                endpoint: endpoint,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });
            this.logger.log('StorageService initialized with R2/S3');
        } else {
            this.logger.warn('R2/S3 credentials not found. File uploads will be mocked or fail.');
        }
    }

    async getUploadUrl(
        filename: string,
        contentType: string,
        prefix: string = 'uploads',
    ) {
        if (!this.s3Client) {
            // Mock mode for local dev without R2
            this.logger.warn('Mocking upload URL (No S3 credentials)');
            return {
                uploadUrl: 'http://localhost:3000/api/v1/storage/mock-upload',
                key: `${prefix}/${uuidv4()}-${filename}`,
                publicUrl: 'https://placehold.co/600x400?text=Mock+Upload',
            };
        }

        const key = `${prefix}/${uuidv4()}-${filename}`;
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });

        try {
            const uploadUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn: 3600,
            });

            // Construct public URL (assuming public access or worker)
            // For R2, if public access is custom, you might need a separate env var.
            // Defaulting to endpoint + key structure or a specific PUBLIC_URL_BASE
            const publicUrlBase = process.env.PUBLIC_STORAGE_URL || process.env.R2_ENDPOINT;
            const publicUrl = `${publicUrlBase}/${key}`;

            return { uploadUrl, key, publicUrl };
        } catch (error) {
            this.logger.error('Failed to generate presigned URL', error);
            throw error;
        }
    }
}
