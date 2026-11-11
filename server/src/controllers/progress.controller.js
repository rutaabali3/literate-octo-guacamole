const ProgressEntry = require('../models/ProgressEntry.model');
const Notification = require('../models/Notification.model');

const getProgressEntries = async (req, res, next) => {
  try {
    const { range = '90d' } = req.query;
    let days = 90;
    if (range === '30d') days = 30;
    if (range === '180d') days = 180;
    if (range === '365d') days = 365;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const entries = await ProgressEntry.find({
      userId: req.user.id,
      recordedAt: { $gte: fromDate }
    }).sort({ recordedAt: 1 }).lean();

    let deltas = {
      weightKgDelta: 0,
      bodyFatDelta: 0,
      benchMaxDelta: 0,
      squatMaxDelta: 0,
      deadliftMaxDelta: 0
    };

    if (entries.length >= 2) {
      const first = entries[0];
      const latest = entries[entries.length - 1];
      deltas = {
        weightKgDelta: +(latest.weightKg - first.weightKg).toFixed(1),
        bodyFatDelta: latest.bodyFatPct && first.bodyFatPct ? +(latest.bodyFatPct - first.bodyFatPct).toFixed(1) : 0,
        benchMaxDelta: +( (latest.performanceMetrics?.benchPressMaxKg || 0) - (first.performanceMetrics?.benchPressMaxKg || 0) ).toFixed(1),
        squatMaxDelta: +( (latest.performanceMetrics?.squatMaxKg || 0) - (first.performanceMetrics?.squatMaxKg || 0) ).toFixed(1),
        deadliftMaxDelta: +( (latest.performanceMetrics?.deadliftMaxKg || 0) - (first.performanceMetrics?.deadliftMaxKg || 0) ).toFixed(1)
      };
    }

    res.status(200).json({
      entries,
      deltas
    });
  } catch (error) {
    next(error);
  }
};

const createProgressEntry = async (req, res, next) => {
  try {
    const { recordedAt, weightKg, bodyFatPct, measurementsCm, performanceMetrics, notes } = req.body;

    const entry = new ProgressEntry({
      userId: req.user.id,
      recordedAt: recordedAt || new Date(),
      weightKg,
      bodyFatPct,
      measurementsCm: measurementsCm || {},
      performanceMetrics: performanceMetrics || {},
      notes: notes || ''
    });

    await entry.save();

    const notifications = [];
    if (performanceMetrics?.benchPressMaxKg || performanceMetrics?.squatMaxKg || performanceMetrics?.deadliftMaxKg) {
      const notif = await Notification.create({
        userId: req.user.id,
        category: 'goal_achieved',
        title: 'Performance Benchmark Recorded',
        message: `Updated benchmarks: Bench ${performanceMetrics.benchPressMaxKg || 0}kg, Squat ${performanceMetrics.squatMaxKg || 0}kg, Deadlift ${performanceMetrics.deadliftMaxKg || 0}kg.`
      });
      notifications.push(notif);
    }

    res.status(201).json({
      entry,
      newNotifications: notifications
    });
  } catch (error) {
    next(error);
  }
};

const deleteProgressEntry = async (req, res, next) => {
  try {
    const entry = await ProgressEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) {
      return res.status(404).json({ message: 'Progress entry not found or unauthorized' });
    }
    res.status(200).json({ deletedId: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgressEntries,
  createProgressEntry,
  deleteProgressEntry
};
