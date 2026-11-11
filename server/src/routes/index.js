const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const workoutRoutes = require('./workout.routes');
const nutritionRoutes = require('./nutrition.routes');
const progressRoutes = require('./progress.routes');
const analyticsRoutes = require('./analytics.routes');
const searchRoutes = require('./search.routes');
const reminderRoutes = require('./reminder.routes');
const notificationRoutes = require('./notification.routes');
const reportRoutes = require('./report.routes');
const supportRoutes = require('./support.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workouts', workoutRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/progress', progressRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/dashboard', analyticsRoutes);
router.use('/search', searchRoutes);
router.use('/reminders', reminderRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/support', supportRoutes);

module.exports = router;
