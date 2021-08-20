const request = require('supertest');
const app = require('../../src/app');
const factory = require('../factories');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate();
    });
    
    it('should authenticate with valid credentials', async () => {
        const user = await factory.create('User', {
            password: '123'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123'
        });

        expect(response.status).toBe(200);
    });

    it('should not authenticate with invalid credentials', async () => {
        const user = await factory.create('User', {
            password: '123'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '101'
        });

        expect(response.status).toBe(401);
    });

    it('should return JWT token when authenticated with success', async () => {
        const user = await factory.create('User', {
            password: '123'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123'
        });

        expect(response.body).toHaveProperty('token');
    });

    it('should be able to access private routes using JWT token', async () => {
        const user = await factory.create('User', {
            password: '123'
        });

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${user.generateToken()}`);

        expect(response.status).toBe(200);
    });

    it('should not be able to access private routes without JWT token', async () => {
        const response = await request(app)
            .get('/dashboard');

        expect(response.status).toBe(401);
    });

    it('should not be able to access private routes with invalid JWT token', async () => {
        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer 0123456789`);
        
        expect(response.status).toBe(401);
    });
});
