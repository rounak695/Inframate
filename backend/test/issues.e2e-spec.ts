import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('IssuesController (e2e)', () => {
    let app: INestApplication;
    let authToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Login to get auth token
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'admin@demo.edu',
                password: 'password123',
            });

        authToken = loginResponse.body.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/issues (GET)', () => {
        it('should return 401 without auth token', () => {
            return request(app.getHttpServer())
                .get('/issues')
                .expect(401);
        });

        it('should return 200 with issues list when authenticated', () => {
            return request(app.getHttpServer())
                .get('/issues')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                });
        });
    });

    describe('/issues (POST)', () => {
        it('should create a new issue with valid data', async () => {
            // First, get a category ID
            const categoriesResponse = await request(app.getHttpServer())
                .get('/categories')
                .set('Authorization', `Bearer ${authToken}`);

            const categoryId = categoriesResponse.body[0]?.id;

            if (!categoryId) {
                console.warn('No categories found, skipping issue creation test');
                return;
            }

            return request(app.getHttpServer())
                .post('/issues')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Issue E2E',
                    description: 'This is a test issue created during E2E testing',
                    categoryId,
                    priority: 'MEDIUM',
                    location: 'Test Building',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.title).toBe('Test Issue E2E');
                });
        });

        it('should return 400 with invalid priority', () => {
            return request(app.getHttpServer())
                .post('/issues')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Issue',
                    description: 'Test',
                    categoryId: 'some-id',
                    priority: 'INVALID_PRIORITY',
                })
                .expect(400);
        });
    });
});
