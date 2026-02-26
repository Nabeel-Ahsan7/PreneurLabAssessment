import request from 'supertest';
import app from '../app';
import { connectTestDB, closeTestDB, clearTestDB } from './setup';

let userToken: string;
let adminToken: string;
let productId: string;

beforeAll(async () => {
    await connectTestDB();

    // Register admin
    const adminRes = await request(app).post('/auth/register').send({
        name: 'Admin',
        email: 'admin@order.com',
        password: 'password123',
        role: 'admin',
    });
    adminToken = adminRes.body.accessToken;

    // Register user
    const userRes = await request(app).post('/auth/register').send({
        name: 'User',
        email: 'user@order.com',
        password: 'password123',
    });
    userToken = userRes.body.accessToken;

    // Create a product
    const productRes = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Order Test Product')
        .field('price', '50')
        .field('stock', '20')
        .field('description', 'For order testing');
    productId = productRes.body._id;
});

afterAll(async () => await closeTestDB());

describe('Order Flow', () => {
    it('should add item to cart', async () => {
        const res = await request(app)
            .post('/cart')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ productId, quantity: 2 });
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(1);
    });

    it('should get cart', async () => {
        const res = await request(app)
            .get('/cart')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(1);
    });

    it('should place an order', async () => {
        const res = await request(app)
            .post('/orders')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(201);
        expect(res.body.totalAmount).toBe(100); // 50 * 2
        expect(res.body.items.length).toBe(1);
    });

    it('should have empty cart after order', async () => {
        const res = await request(app)
            .get('/cart')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(0);
    });

    it('should get user orders', async () => {
        const res = await request(app)
            .get('/orders')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });
});
