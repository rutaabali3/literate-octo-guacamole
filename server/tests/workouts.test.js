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
      username: 'workoutrunner',
      email: 'workout@pulseforge.io',
      password: 'Password123!',
      fullName: 'Workout Runner'
    });
  token = regRes.body.accessToken;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Workouts API Endpoints (FR-04, FR-08)', () => {
  let workoutId;

  it('POST /api/v1/workouts creates workout and calculates volume', async () => {
    const res = await request(app)
      .post('/api/v1/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Push Day Chest & Triceps',
        category: 'Strength',
        tags: ['push', 'chest'],
        durationMinutes: 60,
        caloriesBurned: 450,
        exercises: [
          { exerciseName: 'Bench Press', sets: 3, reps: 10, weightKg: 80, rpe: 8 },
          { exerciseName: 'Overhead Press', sets: 3, reps: 8, weightKg: 50, rpe: 8 }
        ],
        notes: 'Great pump'
      });

    expect(res.status).toBe(201);
    expect(res.body.workout).toHaveProperty('_id');
    // 3*10*80 = 2400, 3*8*50 = 1200 => total 3600
    expect(res.body.workout.totalVolumeKg).toBe(3600);
    workoutId = res.body.workout._id;
  });

  it('GET /api/v1/workouts lists user workouts with filters', async () => {
    const res = await request(app)
      .get('/api/v1/workouts?category=Strength')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.totalVolume).toBe(3600);
  });

  it('PUT /api/v1/workouts/:id updates workout routine', async () => {
    const res = await request(app)
      .put(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Push Day Session'
      });

    expect(res.status).toBe(200);
    expect(res.body.workout.title).toBe('Updated Push Day Session');
  });

  it('DELETE /api/v1/workouts/:id deletes workout routine', async () => {
    const res = await request(app)
      .delete(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.deletedId).toBe(workoutId);
  });
});
