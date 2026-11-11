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
      username: 'nutritionhero',
      email: 'hero@pulseforge.io',
      password: 'Password123!',
      fullName: 'Nutrition Hero'
    });
  token = regRes.body.accessToken;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Nutrition API Endpoints (FR-05, FR-09)', () => {
  let logId;

  it('POST /api/v1/nutrition creates meal and aggregates macros', async () => {
    const res = await request(app)
      .post('/api/v1/nutrition')
      .set('Authorization', `Bearer ${token}`)
      .send({
        mealType: 'Breakfast',
        waterMl: 500,
        items: [
          { name: 'Oats', quantity: 100, unit: 'g', calories: 380, proteinGrams: 13, carbsGrams: 67, fatGrams: 7 },
          { name: 'Eggs', quantity: 3, unit: 'serving', calories: 210, proteinGrams: 18, carbsGrams: 1, fatGrams: 15 }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.log.totals.calories).toBe(590);
    expect(res.body.log.totals.proteinGrams).toBe(31);
    expect(res.body.log.totals.fatGrams).toBe(22);
    expect(res.body.dailyTotals.calories).toBe(590);
    logId = res.body.log._id;
  });

  it('GET /api/v1/nutrition lists daily logs and returns totals', async () => {
    const res = await request(app)
      .get('/api/v1/nutrition?mealType=Breakfast')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.logs.length).toBe(1);
    expect(res.body.dailyTotals.proteinGrams).toBe(31);
  });

  it('DELETE /api/v1/nutrition/:id removes meal log', async () => {
    const res = await request(app)
      .delete(`/api/v1/nutrition/${logId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.deletedId).toBe(logId);
  });
});
