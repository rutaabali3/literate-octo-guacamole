const Workout = require('../models/Workout.model');
const NutritionLog = require('../models/NutritionLog.model');
const ProgressEntry = require('../models/ProgressEntry.model');
const { generateCsvReport } = require('../utils/csvExporter');

const exportData = async (req, res, next) => {
  try {
    const { format = 'csv', scope = 'all', range = '30d' } = req.query;
    const userId = req.user.id;

    let days = 30;
    if (range === '7d') days = 7;
    if (range === '90d') days = 90;
    if (range === '365d') days = 365;
    if (range === 'all') days = 3650;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const [workouts, nutrition, progress] = await Promise.all([
      (scope === 'all' || scope === 'workouts')
        ? Workout.find({ userId, performedAt: { $gte: fromDate } }).sort({ performedAt: -1 }).lean()
        : [],
      (scope === 'all' || scope === 'nutrition')
        ? NutritionLog.find({ userId, loggedDate: { $gte: fromDate } }).sort({ loggedDate: -1 }).lean()
        : [],
      (scope === 'all' || scope === 'progress')
        ? ProgressEntry.find({ userId, recordedAt: { $gte: fromDate } }).sort({ recordedAt: -1 }).lean()
        : []
    ]);

    if (format === 'csv') {
      const csvData = generateCsvReport(scope, { workouts, nutrition, progress });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="pulseforge-${scope}-export.csv"`);
      return res.status(200).send(csvData);
    }

    res.status(200).json({
      scope,
      range,
      exportedAt: new Date().toISOString(),
      workouts,
      nutrition,
      progress
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportData
};
