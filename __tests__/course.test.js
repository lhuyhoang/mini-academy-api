const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const Course = require('../src/models/Course');

process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '7d';

const createApp = () => {
    const app = express();

    app.use(express.json());

    const courseRouter = require('../src/routes/courseRoutes');
    const authRouter = require('../src/routes/authRoutes');

    app.use('/api/auth', authRouter);
    app.use('/api/courses', courseRouter);

    app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            status: err.status || 'error',
            message: err.message || 'Internal Server Error',
        });
    });

    return app;
};

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

let mongoServer;
let app;
let adminToken;
let adminUser;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    app = createApp();

    adminUser = await User.create({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'Admin@123',
        role: 'admin',
    });
    adminToken = createToken(adminUser._id);
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}, 30000);

beforeEach(async () => {
    await Course.deleteMany({});
});

describe('GET /api/courses', () => {
    it('tra ve mang rong khi chua co khoa hoc nao', async () => {
        const res = await request(app).get('/api/courses');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.results).toBe(0);
        expect(res.body.data).toEqual([]);
    });

    it('tra ve danh sach khoa hoc', async () => {
        await Course.create([
            { title: 'Node.js co ban', description: 'Hoc Node.js', price: 29.99, instructor: 'Nguyen Van A' },
            { title: 'React nang cao', description: 'Hoc React', price: 39.99, instructor: 'Tran Thi B' },
        ]);

        const res = await request(app).get('/api/courses');

        expect(res.status).toBe(200);
        expect(res.body.results).toBe(2);
        expect(res.body.data.length).toBe(2);
    });
});

describe('POST /api/courses', () => {
    it('tra ve 400 khi thieu title', async () => {
        const res = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ price: 29.99, instructor: 'Nguyen Van A' });

        expect(res.status).toBe(400);
        expect(res.body.status).toBe('fail');
    });
});

describe('DELETE /api/courses/:id', () => {
    it('tra ve 401 khi khong co token', async () => {
        const course = await Course.create({
            title: 'Test Course',
            description: 'Test',
            price: 10,
            instructor: 'Test',
        });

        const res = await request(app).delete(`/api/courses/${course._id}`);

        expect(res.status).toBe(401);
        expect(res.body.status).toBe('fail');
    });
});
