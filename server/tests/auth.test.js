const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth API Endpoints (FR-01, FR-02, FR-03, FR-15)', () => {
  let accessToken;

  it('POST /api/v1/auth/register should register a new athlete', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testathlete',
        email: 'athlete@test.io',
        password: 'Password123!',
        fullName: 'Test Athlete',
        fitnessGoal: 'Strength & Hypertrophy'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toHaveProperty('username', 'testathlete');
    expect(res.body.user).not.toHaveProperty('passwordHash');
    accessToken = res.body.accessToken;
  });

  it('POST /api/v1/auth/login should authenticate user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        usernameOrEmail: 'testathlete',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('GET /api/v1/users/me should fetch profile with auth token', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('testathlete');
  });

  it('PATCH /api/v1/users/me/preferences should update preferences', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me/preferences')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        unitSystem: 'imperial',
        theme: 'light'
      });

    expect(res.status).toBe(200);
    expect(res.body.preferences.unitSystem).toBe('imperial');
    expect(res.body.preferences.theme).toBe('light');
  });
});
