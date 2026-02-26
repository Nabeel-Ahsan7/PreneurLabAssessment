import request from 'supertest';
import app from '../app';
import { connectTestDB, closeTestDB, clearTestDB } from './setup';

let adminToken: string;
let categoryId: string;

beforeAll(async () => {
    await connectTestDB();
    // Register admin user
    const res = await request(app).post('/auth/register').send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
    });
    adminToken = res.body.accessToken;
});

afterAll(async () => await closeTestDB());

describe('Product CRUD', () => {
    beforeAll(async () => {
        // Create a category
        const catRes = await request(app)
            .post('/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Electronics' });
        categoryId = catRes.body._id;
    });

    let productId: string;

    it('should create a product (admin)', async () => {
        const res = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', 'Test Laptop')
            .field('price', '999.99')
            .field('stock', '10')
            .field('description', 'A great laptop for testing')
            .field('categories', JSON.stringify([categoryId]));
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Test Laptop');
        productId = res.body._id;
    });

    it('should get all products', async () => {
        const res = await request(app).get('/products');
        expect(res.status).toBe(200);
        expect(res.body.products.length).toBeGreaterThan(0);
        expect(res.body.pagination).toBeDefined();
    });

    it('should get product by ID', async () => {
        const res = await request(app).get(`/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Test Laptop');
    });

    it('should search products', async () => {
        const res = await request(app).get('/products?search=laptop');
        expect(res.status).toBe(200);
        expect(res.body.products.length).toBeGreaterThan(0);
    });

    it('should update a product (admin)', async () => {
        const res = await request(app)
            .put(`/products/${productId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', 'Updated Laptop')
            .field('price', '1099.99');
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Laptop');
    });

    it('should delete a product (admin)', async () => {
        const res = await request(app)
            .delete(`/products/${productId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });
});
