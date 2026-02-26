import request from 'supertest';
import app from '../app';
import { connectTestDB, closeTestDB, clearTestDB } from './setup';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Auth Endpoints', () => {
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    };

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app).post('/auth/register').send(testUser);
            expect(res.status).toBe(201);
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.accessToken).toBeDefined();
            expect(res.body.refreshToken).toBeDefined();
        });

        it('should fail with duplicate email', async () => {
            await request(app).post('/auth/register').send(testUser);
            const res = await request(app).post('/auth/register').send(testUser);
            expect(res.status).toBe(409);
        });

        it('should fail with missing fields', async () => {
            const res = await request(app).post('/auth/register').send({ email: 'a@b.com' });
            expect(res.status).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            await request(app).post('/auth/register').send(testUser);
            const res = await request(app).post('/auth/login').send({
                email: testUser.email,
                password: testUser.password,
            });
            expect(res.status).toBe(200);
            expect(res.body.accessToken).toBeDefined();
        });

        it('should fail with wrong password', async () => {
            await request(app).post('/auth/register').send(testUser);
            const res = await request(app).post('/auth/login').send({
                email: testUser.email,
                password: 'wrongpassword',
            });
            expect(res.status).toBe(401);
        });
    });

    describe('POST /auth/refresh-token', () => {
        it('should refresh tokens', async () => {
            const registerRes = await request(app).post('/auth/register').send(testUser);
            const res = await request(app).post('/auth/refresh-token').send({
                refreshToken: registerRes.body.refreshToken,
            });
            expect(res.status).toBe(200);
            expect(res.body.accessToken).toBeDefined();
            expect(res.body.refreshToken).toBeDefined();
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout successfully', async () => {
            const registerRes = await request(app).post('/auth/register').send(testUser);
            const res = await request(app)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${registerRes.body.accessToken}`);
            expect(res.status).toBe(200);
        });
    });
});
