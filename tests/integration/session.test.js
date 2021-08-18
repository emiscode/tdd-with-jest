const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/app/models');

describe('Authentication', () => {
    it('should authenticate with valid credentials', async () => {
        const user = await User.create({
            name: 'emilio',
            email: 'emiscode@gmail.com',
            password_hash: '123'
        });

        const response = await request(app)
        .post('sessions')
        .send({
            email: user.email,
            password: '333'
        });

        expect(response.status).toBe(200);
    });
});
