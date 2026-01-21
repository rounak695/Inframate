import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/auth/login (POST)', () => {
        it('should return 200 and access token with valid credentials', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'admin@demo.edu',
                    password: 'password123',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('accessToken');
                    expect(res.body).toHaveProperty('user');
                    expect(res.body.user.email).toBe('admin@demo.edu');
                });
        });

        it('should return 401 with invalid credentials', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'admin@demo.edu',
                    password: 'wrongpassword',
                })
                .expect(401);
        });

        it('should return 400 with missing fields', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'admin@demo.edu',
                })
                .expect(400);
        });
    });

    describe('/auth/register (POST)', () => {
        it('should return 400 for duplicate email', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'admin@demo.edu', // Already exists from seed
                    password: 'password123',
                    firstName: 'Test',
                    lastName: 'User',
                    campusId: 'test-campus',
                    role: 'STUDENT',
                })
                .expect(409); // Conflict
        });
    });
});
