const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const regRes = await request(app)
    .post('/api/v1/auth/register')
    .send({
      username: 'progressguru',
      email: 'guru@pulseforge.io',
      password: 'Password123!',
      fullName: 'Progress Guru'
    });
  token = regRes.body.accessToken;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Progress & Analytics Endpoints (FR-06, FR-07, FR-08, FR-09)', () => {
  it('POST /api/v1/progress records check-in and personal records', async () => {
    const res = await request(app)
      .post('/api/v1/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        weightKg: 80.5,
        bodyFatPct: 15.0,
        measurementsCm: { waist: 82, chest: 104, arms: 38 },
        performanceMetrics: { benchPressMaxKg: 100, squatMaxKg: 140, deadliftMaxKg: 180, run5kTimeMinutes: 22.5 }
      });

    expect(res.status).toBe(201);
    expect(res.body.entry.weightKg).toBe(80.5);
  });

  it('GET /api/v1/progress returns chronological logs and deltas', async () => {
    // Add second entry to test delta calculation
    await request(app)
      .post('/api/v1/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        weightKg: 79.2,
        bodyFatPct: 14.2,
        performanceMetrics: { benchPressMaxKg: 105, squatMaxKg: 145, deadliftMaxKg: 185, run5kTimeMinutes: 21.8 }
      });

    const res = await request(app)
      .get('/api/v1/progress')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.entries.length).toBe(2);
    expect(res.body.deltas.weightKgDelta).toBe(-1.3);
    expect(res.body.deltas.benchMaxDelta).toBe(5);
  });

  it('GET /api/v1/analytics/overview returns aggregated charts data', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/overview?range=30d')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('volumeSeries');
    expect(res.body).toHaveProperty('macroSplit');
    expect(res.body).toHaveProperty('prSummary');
    expect(res.body.prSummary.benchPressMaxKg).toBe(105);
  });
});
