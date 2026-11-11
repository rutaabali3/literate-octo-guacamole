const mongoose = require('mongoose');
const User = require('../models/User.model');
const Workout = require('../models/Workout.model');
const NutritionLog = require('../models/NutritionLog.model');
const ProgressEntry = require('../models/ProgressEntry.model');
const Reminder = require('../models/Reminder.model');
const Notification = require('../models/Notification.model');
const SupportTicket = require('../models/SupportTicket.model');
const connectDB = require('../config/db');
const env = require('../config/env');
const logger = require('../config/logger');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB(env.MONGO_URI);
    }

    logger.info('Purging existing database collections for clean seeding...');
    await Promise.all([
      User.deleteMany({}),
      Workout.deleteMany({}),
      NutritionLog.deleteMany({}),
      ProgressEntry.deleteMany({}),
      Reminder.deleteMany({}),
      Notification.deleteMany({}),
      SupportTicket.deleteMany({})
    ]);

    logger.info('Creating demo athletes: Ahsan Khan (@ahsankhan) and Sara Malik (@saramalik)...');

    const ahsan = new User({
      username: 'ahsankhan',
      email: 'ahsan@pulseforge.io',
      passwordHash: 'Password123!',
      profile: {
        fullName: 'Ahsan Khan',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        bio: 'Competitive powerlifter & marathon runner. Passionate about strength progression.',
        fitnessGoal: 'Strength & Hypertrophy',
        targetWeightKg: 82.0,
        dailyCalorieTarget: 2750,
        macroTargets: {
          proteinGrams: 200,
          carbsGrams: 280,
          fatGrams: 80
        },
        weeklyWorkoutGoal: 5
      },
      preferences: {
        unitSystem: 'metric',
        theme: 'dark',
        profileVisibility: 'public',
        notifications: {
          workoutCompletion: true,
          goalAchievement: true,
          newFollowers: true,
          forumResponses: true,
          remindersEnabled: true
        },
        gdprConsent: { accepted: true, acceptedAt: new Date() }
      }
    });

    const sara = new User({
      username: 'saramalik',
      email: 'sara@pulseforge.io',
      passwordHash: 'Password123!',
      profile: {
        fullName: 'Sara Malik',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
        bio: 'HIIT instructor & calisthenics practitioner. Striving for everyday endurance.',
        fitnessGoal: 'Fat Loss & Conditioning',
        targetWeightKg: 62.0,
        dailyCalorieTarget: 2100,
        macroTargets: {
          proteinGrams: 140,
          carbsGrams: 210,
          fatGrams: 60
        },
        weeklyWorkoutGoal: 4
      },
      preferences: {
        unitSystem: 'imperial',
        theme: 'dark',
        profileVisibility: 'public',
        notifications: {
          workoutCompletion: true,
          goalAchievement: true,
          newFollowers: true,
          forumResponses: true,
          remindersEnabled: true
        },
        gdprConsent: { accepted: true, acceptedAt: new Date() }
      }
    });

    await Promise.all([ahsan.save(), sara.save()]);

    ahsan.social.following.push(sara._id);
    sara.social.followers.push(ahsan._id);
    await Promise.all([ahsan.save(), sara.save()]);

    logger.info('Populating Ahsan workouts with exercise sets...');
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    const w1 = new Workout({
      userId: ahsan._id,
      title: 'Heavy Push Day: Bench & Overhead Press',
      category: 'Strength',
      tags: ['push', 'chest', 'hypertrophy', 'strength'],
      performedAt: new Date(now.getTime() - 2 * dayMs),
      durationMinutes: 75,
      caloriesBurned: 520,
      exercises: [
        { exerciseName: 'Barbell Bench Press', sets: 4, reps: 6, weightKg: 102.5, rpe: 9, notes: 'Felt solid, hit 102.5kg PR' },
        { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: 10, weightKg: 34, rpe: 8, notes: 'Strict tempo' },
        { exerciseName: 'Standing Overhead Press', sets: 4, reps: 8, weightKg: 62.5, rpe: 8.5, notes: 'Locked out clean' },
        { exerciseName: 'Triceps Rope Pushdown', sets: 3, reps: 15, weightKg: 28, rpe: 8, notes: 'High pump finish' }
      ],
      notes: 'Terrific energy level after creatine loading.'
    });

    const w2 = new Workout({
      userId: ahsan._id,
      title: 'Leg Day & Squat Progression',
      category: 'Strength',
      tags: ['legs', 'squat', 'quads'],
      performedAt: new Date(now.getTime() - 4 * dayMs),
      durationMinutes: 80,
      caloriesBurned: 640,
      exercises: [
        { exerciseName: 'Barbell Back Squat', sets: 5, reps: 5, weightKg: 145, rpe: 9, notes: 'Deep below parallel' },
        { exerciseName: 'Romanian Deadlift', sets: 4, reps: 8, weightKg: 120, rpe: 8.5, notes: 'Hamstrings loaded' },
        { exerciseName: 'Leg Press', sets: 3, reps: 12, weightKg: 240, rpe: 8, notes: 'Wide stance' },
        { exerciseName: 'Standing Calf Raise', sets: 4, reps: 15, weightKg: 70, rpe: 7.5, notes: 'Controlled eccentric' }
      ],
      notes: 'Heavy session, dialed in recovery hydration.'
    });

    const w3 = new Workout({
      userId: ahsan._id,
      title: 'Morning Tempo Run & Aerobic Base',
      category: 'Cardio',
      tags: ['running', 'endurance', 'tempo'],
      performedAt: new Date(now.getTime() - 1 * dayMs),
      durationMinutes: 35,
      caloriesBurned: 390,
      exercises: [
        { exerciseName: '5K Outdoor Road Run', sets: 1, reps: 1, weightKg: 0, rpe: 7, notes: 'Completed in 21 mins 45 secs' }
      ],
      notes: 'Crisp morning air, smooth breathing cadence.'
    });

    await Promise.all([w1.save(), w2.save(), w3.save()]);

    logger.info('Populating Nutrition logs...');
    const n1 = new NutritionLog({
      userId: ahsan._id,
      loggedDate: new Date(now.getTime() - 0 * dayMs),
      mealType: 'Breakfast',
      waterMl: 650,
      items: [
        { name: 'Oatmeal with Almond Milk', quantity: 120, unit: 'g', calories: 450, proteinGrams: 16, carbsGrams: 78, fatGrams: 8 },
        { name: 'Whey Protein Isolate', quantity: 35, unit: 'g', calories: 140, proteinGrams: 28, carbsGrams: 2, fatGrams: 1 },
        { name: 'Fresh Blueberries', quantity: 100, unit: 'g', calories: 60, proteinGrams: 1, carbsGrams: 14, fatGrams: 0.5 }
      ],
      notes: 'Pre-workout carbs & protein loaded.'
    });

    const n2 = new NutritionLog({
      userId: ahsan._id,
      loggedDate: new Date(now.getTime() - 0 * dayMs),
      mealType: 'Lunch',
      waterMl: 800,
      items: [
        { name: 'Grilled Chicken Breast', quantity: 220, unit: 'g', calories: 360, proteinGrams: 68, carbsGrams: 0, fatGrams: 6 },
        { name: 'Brown Basmati Rice', quantity: 200, unit: 'g', calories: 240, proteinGrams: 5, carbsGrams: 52, fatGrams: 2 },
        { name: 'Steamed Broccoli & Olive Oil', quantity: 150, unit: 'g', calories: 120, proteinGrams: 4, carbsGrams: 10, fatGrams: 7 }
      ],
      notes: 'Post-training restorative lunch.'
    });

    const n3 = new NutritionLog({
      userId: ahsan._id,
      loggedDate: new Date(now.getTime() - 0 * dayMs),
      mealType: 'Dinner',
      waterMl: 700,
      items: [
        { name: 'Baked Atlantic Salmon Fillet', quantity: 200, unit: 'g', calories: 420, proteinGrams: 44, carbsGrams: 0, fatGrams: 26 },
        { name: 'Roasted Sweet Potato', quantity: 250, unit: 'g', calories: 230, proteinGrams: 4, carbsGrams: 54, fatGrams: 1 },
        { name: 'Mixed Green Salad with Avocado', quantity: 120, unit: 'g', calories: 180, proteinGrams: 3, carbsGrams: 8, fatGrams: 16 }
      ],
      notes: 'Rich healthy fats and micronutrients.'
    });

    await Promise.all([n1.save(), n2.save(), n3.save()]);

    logger.info('Populating Progress entries & PR history...');
    const p1 = new ProgressEntry({
      userId: ahsan._id,
      recordedAt: new Date(now.getTime() - 60 * dayMs),
      weightKg: 85.5,
      bodyFatPct: 18.2,
      measurementsCm: { waist: 88, chest: 106, arms: 38, thighs: 61 },
      performanceMetrics: { benchPressMaxKg: 95, squatMaxKg: 135, deadliftMaxKg: 170, run5kTimeMinutes: 24.5 },
      notes: 'Initial baseline assessment.'
    });

    const p2 = new ProgressEntry({
      userId: ahsan._id,
      recordedAt: new Date(now.getTime() - 30 * dayMs),
      weightKg: 84.1,
      bodyFatPct: 16.8,
      measurementsCm: { waist: 86, chest: 108, arms: 39, thighs: 62 },
      performanceMetrics: { benchPressMaxKg: 100, squatMaxKg: 140, deadliftMaxKg: 180, run5kTimeMinutes: 23.0 },
      notes: 'Month 1 check-in: waist reduced, strength rising.'
    });

    const p3 = new ProgressEntry({
      userId: ahsan._id,
      recordedAt: new Date(now.getTime() - 1 * dayMs),
      weightKg: 83.2,
      bodyFatPct: 15.5,
      measurementsCm: { waist: 84, chest: 110, arms: 40, thighs: 63 },
      performanceMetrics: { benchPressMaxKg: 105, squatMaxKg: 150, deadliftMaxKg: 190, run5kTimeMinutes: 21.75 },
      notes: 'Latest check-in: crossed 105kg bench benchmark!'
    });

    await Promise.all([p1.save(), p2.save(), p3.save()]);

    logger.info('Populating Reminders, Notifications & Support tickets...');
    const r1 = new Reminder({
      userId: ahsan._id,
      title: 'Morning Push Workout Session',
      type: 'Workout',
      timeOfDay: '07:00',
      daysOfWeek: ['Mon', 'Wed', 'Fri'],
      enabled: true
    });

    const r2 = new Reminder({
      userId: ahsan._id,
      title: 'Hydration Target: 500ml Water',
      type: 'Hydration',
      timeOfDay: '11:30',
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true
    });

    await Promise.all([r1.save(), r2.save()]);

    const notif1 = new Notification({
      userId: ahsan._id,
      category: 'goal_achieved',
      title: 'New Personal Record!',
      message: 'Congratulations! Barbell Bench Press reached 105kg!',
      isRead: false
    });

    const notif2 = new Notification({
      userId: ahsan._id,
      category: 'new_follower',
      title: 'New Follower',
      message: 'Sara Malik followed your athlete profile.',
      isRead: false
    });

    await Promise.all([notif1.save(), notif2.save()]);

    const ticket = new SupportTicket({
      userId: ahsan._id,
      subject: 'Apple Watch Bluetooth Heart Rate Sync',
      category: 'Feature Request',
      priority: 'Medium',
      description: 'Would love real-time heart rate sensor integration during cardio workouts.',
      status: 'In Progress',
      staffResponse: 'Great suggestion Ahsan! Our team has queued BLE heart rate strap integration for Q1.'
    });

    await ticket.save();

    logger.info('PulseForge database seeded successfully with realistic demo athletes!');
    return { ahsan, sara };
  } catch (err) {
    logger.error(`Seeding error: ${err.message}`);
    throw err;
  }
};

if (require.main === module) {
  seedData()
    .then(() => {
      logger.info('Seeding finished cleanly.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedData;
