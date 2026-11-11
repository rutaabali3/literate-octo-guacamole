const mongoose = require('mongoose');
const Workout = require('../models/Workout.model');
const NutritionLog = require('../models/NutritionLog.model');
const ProgressEntry = require('../models/ProgressEntry.model');
const User = require('../models/User.model');

const getOverviewAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { range = '30d' } = req.query;
    let days = 30;
    if (range === '7d') days = 7;
    if (range === '90d') days = 90;
    if (range === '180d') days = 180;
    if (range === '365d') days = 365;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const volumeSeries = await Workout.aggregate([
      { $match: { userId, performedAt: { $gte: fromDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$performedAt' } },
          volume: { $sum: '$totalVolumeKg' },
          caloriesBurned: { $sum: '$caloriesBurned' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', volume: 1, caloriesBurned: 1, count: 1, _id: 0 } }
    ]);

    const nutritionStats = await NutritionLog.aggregate([
      { $match: { userId, loggedDate: { $gte: fromDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$loggedDate' } },
          totalCalories: { $sum: '$totals.calories' },
          totalProtein: { $sum: '$totals.proteinGrams' },
          totalCarbs: { $sum: '$totals.carbsGrams' },
          totalFat: { $sum: '$totals.fatGrams' },
          totalWater: { $sum: '$waterMl' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          totalCalories: 1,
          totalProtein: 1,
          totalCarbs: 1,
          totalFat: 1,
          totalWater: 1,
          _id: 0
        }
      }
    ]);

    const aggregateMacroSplit = nutritionStats.reduce(
      (acc, day) => {
        acc.protein += day.totalProtein;
        acc.carbs += day.totalCarbs;
        acc.fat += day.totalFat;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );

    const weightSeries = await ProgressEntry.aggregate([
      { $match: { userId, recordedAt: { $gte: fromDate } } },
      { $sort: { recordedAt: 1 } },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' } },
          weightKg: 1,
          bodyFatPct: 1,
          benchPressMaxKg: '$performanceMetrics.benchPressMaxKg',
          squatMaxKg: '$performanceMetrics.squatMaxKg',
          deadliftMaxKg: '$performanceMetrics.deadliftMaxKg',
          _id: 0
        }
      }
    ]);

    const allProgress = await ProgressEntry.find({ userId }).sort({ recordedAt: -1 }).lean();
    const prSummary = {
      benchPressMaxKg: Math.max(...allProgress.map(p => p.performanceMetrics?.benchPressMaxKg || 0), 0),
      squatMaxKg: Math.max(...allProgress.map(p => p.performanceMetrics?.squatMaxKg || 0), 0),
      deadliftMaxKg: Math.max(...allProgress.map(p => p.performanceMetrics?.deadliftMaxKg || 0), 0),
      run5kBestMinutes: Math.min(...allProgress.map(p => p.performanceMetrics?.run5kTimeMinutes || 999).filter(v => v > 0), 0)
    };
    if (prSummary.run5kBestMinutes === 999) prSummary.run5kBestMinutes = 0;

    res.status(200).json({
      volumeSeries,
      macroSplit: {
        proteinGrams: +aggregateMacroSplit.protein.toFixed(1),
        carbsGrams: +aggregateMacroSplit.carbs.toFixed(1),
        fatGrams: +aggregateMacroSplit.fat.toFixed(1)
      },
      calorieSeries: nutritionStats,
      weightSeries,
      prSummary
    });
  } catch (error) {
    next(error);
  }
};

const getWorkoutsAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const categorySplit = await Workout.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalVolume: { $sum: '$totalVolumeKg' },
          totalCalories: { $sum: '$caloriesBurned' }
        }
      },
      { $project: { category: '$_id', count: 1, totalVolume: 1, totalCalories: 1, _id: 0 } }
    ]);

    res.status(200).json({ categorySplit });
  } catch (error) {
    next(error);
  }
};

const getNutritionAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const mealSplit = await NutritionLog.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$mealType',
          count: { $sum: 1 },
          totalCalories: { $sum: '$totals.calories' },
          totalProtein: { $sum: '$totals.proteinGrams' },
          totalCarbs: { $sum: '$totals.carbsGrams' },
          totalFat: { $sum: '$totals.fatGrams' }
        }
      },
      { $project: { mealType: '$_id', count: 1, totalCalories: 1, totalProtein: 1, totalCarbs: 1, totalFat: 1, _id: 0 } }
    ]);

    res.status(200).json({ mealSplit });
  } catch (error) {
    next(error);
  }
};

const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const [recentWorkouts, todayNutrition, weeklyWorkouts, latestProgress] = await Promise.all([
      Workout.find({ userId }).sort({ performedAt: -1 }).limit(5).lean(),
      NutritionLog.find({ userId, loggedDate: { $gte: todayStart, $lte: todayEnd } }).lean(),
      Workout.find({ userId, performedAt: { $gte: weekStart } }).lean(),
      ProgressEntry.findOne({ userId }).sort({ recordedAt: -1 }).lean()
    ]);

    const todayCalories = todayNutrition.reduce((sum, n) => sum + (n.totals?.calories || 0), 0);
    const todayMacros = todayNutrition.reduce(
      (acc, n) => ({
        protein: +(acc.protein + (n.totals?.proteinGrams || 0)).toFixed(1),
        carbs: +(acc.carbs + (n.totals?.carbsGrams || 0)).toFixed(1),
        fat: +(acc.fat + (n.totals?.fatGrams || 0)).toFixed(1),
        water: acc.water + (n.waterMl || 0)
      }),
      { protein: 0, carbs: 0, fat: 0, water: 0 }
    );

    const weeklyVolume = weeklyWorkouts.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
    const weeklyWorkoutsCount = weeklyWorkouts.length;

    res.status(200).json({
      kpis: {
        todayCalories,
        calorieTarget: user.profile?.dailyCalorieTarget || 2400,
        weeklyVolumeKg: weeklyVolume,
        weeklyWorkoutsCount,
        weeklyWorkoutGoal: user.profile?.weeklyWorkoutGoal || 4,
        currentWeightKg: latestProgress?.weightKg || user.profile?.targetWeightKg || 75,
        targetWeightKg: user.profile?.targetWeightKg || 75,
        todayMacros
      },
      recentWorkouts,
      todayNutrition
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewAnalytics,
  getWorkoutsAnalytics,
  getNutritionAnalytics,
  getDashboardSummary
};
