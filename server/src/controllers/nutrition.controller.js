const NutritionLog = require('../models/NutritionLog.model');

const getNutritionLogs = async (req, res, next) => {
  try {
    const { date, mealType, q, limit = 50 } = req.query;
    const filter = { userId: req.user.id };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filter.loggedDate = { $gte: startOfDay, $lte: endOfDay };
    }

    if (mealType) {
      filter.mealType = mealType;
    }

    if (q) {
      filter.$or = [
        { 'items.name': { $regex: q, $options: 'i' } },
        { notes: { $regex: q, $options: 'i' } }
      ];
    }

    const logs = await NutritionLog.find(filter)
      .sort({ loggedDate: -1 })
      .limit(parseInt(limit, 10))
      .lean();

    const dailyTotals = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + (log.totals?.calories || 0),
        proteinGrams: +(acc.proteinGrams + (log.totals?.proteinGrams || 0)).toFixed(1),
        carbsGrams: +(acc.carbsGrams + (log.totals?.carbsGrams || 0)).toFixed(1),
        fatGrams: +(acc.fatGrams + (log.totals?.fatGrams || 0)).toFixed(1),
        waterMl: acc.waterMl + (log.waterMl || 0)
      }),
      { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0, waterMl: 0 }
    );

    res.status(200).json({
      logs,
      dailyTotals
    });
  } catch (error) {
    next(error);
  }
};

const createNutritionLog = async (req, res, next) => {
  try {
    const { loggedDate, mealType, items, waterMl, notes } = req.body;

    const log = new NutritionLog({
      userId: req.user.id,
      loggedDate: loggedDate || new Date(),
      mealType,
      items,
      waterMl: waterMl || 0,
      notes: notes || ''
    });

    await log.save();

    const startOfDay = new Date(log.loggedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(log.loggedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const dayLogs = await NutritionLog.find({
      userId: req.user.id,
      loggedDate: { $gte: startOfDay, $lte: endOfDay }
    }).lean();

    const dailyTotals = dayLogs.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.totals?.calories || 0),
        proteinGrams: +(acc.proteinGrams + (item.totals?.proteinGrams || 0)).toFixed(1),
        carbsGrams: +(acc.carbsGrams + (item.totals?.carbsGrams || 0)).toFixed(1),
        fatGrams: +(acc.fatGrams + (item.totals?.fatGrams || 0)).toFixed(1),
        waterMl: acc.waterMl + (item.waterMl || 0)
      }),
      { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0, waterMl: 0 }
    );

    res.status(201).json({
      log,
      dailyTotals
    });
  } catch (error) {
    next(error);
  }
};

const updateNutritionLog = async (req, res, next) => {
  try {
    const log = await NutritionLog.findOne({ _id: req.params.id, userId: req.user.id });
    if (!log) {
      return res.status(404).json({ message: 'Nutrition log not found or unauthorized' });
    }

    const { loggedDate, mealType, items, waterMl, notes } = req.body;

    if (loggedDate !== undefined) log.loggedDate = loggedDate;
    if (mealType !== undefined) log.mealType = mealType;
    if (items !== undefined) log.items = items;
    if (waterMl !== undefined) log.waterMl = waterMl;
    if (notes !== undefined) log.notes = notes;

    await log.save();

    res.status(200).json({ log });
  } catch (error) {
    next(error);
  }
};

const deleteNutritionLog = async (req, res, next) => {
  try {
    const log = await NutritionLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!log) {
      return res.status(404).json({ message: 'Nutrition log not found or unauthorized' });
    }
    res.status(200).json({ deletedId: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNutritionLogs,
  createNutritionLog,
  updateNutritionLog,
  deleteNutritionLog
};
