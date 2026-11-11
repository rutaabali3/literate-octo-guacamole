const Workout = require('../models/Workout.model');
const Notification = require('../models/Notification.model');
const User = require('../models/User.model');

const checkPersonalRecordsAndGoals = async (userId, newWorkout) => {
  const notifications = [];
  try {
    const user = await User.findById(userId);
    const prevWorkouts = await Workout.find({ userId, _id: { $ne: newWorkout._id } });

    for (const ex of newWorkout.exercises || []) {
      const exNameLower = ex.exerciseName.trim().toLowerCase();
      let maxPreviousWeight = 0;

      for (const pw of prevWorkouts) {
        for (const pex of pw.exercises || []) {
          if (pex.exerciseName.trim().toLowerCase() === exNameLower) {
            if (pex.weightKg > maxPreviousWeight) {
              maxPreviousWeight = pex.weightKg;
            }
          }
        }
      }

      if (ex.weightKg > maxPreviousWeight && maxPreviousWeight > 0) {
        const notif = await Notification.create({
          userId,
          category: 'goal_achieved',
          title: 'New Personal Record!',
          message: `Congratulations! You set a new PR on ${ex.exerciseName}: ${ex.weightKg} kg (up from ${maxPreviousWeight} kg)!`
        });
        notifications.push(notif);
      }
    }

    if (user?.preferences?.notifications?.workoutCompletion !== false) {
      const notif = await Notification.create({
        userId,
        category: 'workout_completed',
        title: 'Workout Logged',
        message: `Awesome session! "${newWorkout.title}" logged with ${newWorkout.totalVolumeKg} kg total volume.`
      });
      notifications.push(notif);
    }
  } catch (err) {
    console.error('Error generating workout notification:', err);
  }
  return notifications;
};

const getWorkouts = async (req, res, next) => {
  try {
    const { category, tag, from, to, q, limit = 50, page = 1 } = req.query;
    const filter = { userId: req.user.id };

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }

    if (from || to) {
      filter.performedAt = {};
      if (from) filter.performedAt.$gte = new Date(from);
      if (to) filter.performedAt.$lte = new Date(to);
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { notes: { $regex: q, $options: 'i' } },
        { 'exercises.exerciseName': { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [items, count] = await Promise.all([
      Workout.find(filter)
        .sort({ performedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Workout.countDocuments(filter)
    ]);

    const totalVolume = items.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);

    res.status(200).json({
      items,
      count,
      totalVolume
    });
  } catch (error) {
    next(error);
  }
};

const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user.id });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(200).json({ workout });
  } catch (error) {
    next(error);
  }
};

const createWorkout = async (req, res, next) => {
  try {
    const { title, category, tags, performedAt, durationMinutes, caloriesBurned, exercises, notes } = req.body;

    const workout = new Workout({
      userId: req.user.id,
      title,
      category,
      tags: Array.isArray(tags) ? tags.map(t => t.toLowerCase()) : [],
      performedAt: performedAt || new Date(),
      durationMinutes,
      caloriesBurned: caloriesBurned || 0,
      exercises,
      notes: notes || ''
    });

    await workout.save();

    const newNotifications = await checkPersonalRecordsAndGoals(req.user.id, workout);

    res.status(201).json({
      workout,
      newNotifications
    });
  } catch (error) {
    next(error);
  }
};

const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user.id });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found or unauthorized' });
    }

    const { title, category, tags, performedAt, durationMinutes, caloriesBurned, exercises, notes } = req.body;

    if (title !== undefined) workout.title = title;
    if (category !== undefined) workout.category = category;
    if (tags !== undefined) workout.tags = tags.map(t => t.toLowerCase());
    if (performedAt !== undefined) workout.performedAt = performedAt;
    if (durationMinutes !== undefined) workout.durationMinutes = durationMinutes;
    if (caloriesBurned !== undefined) workout.caloriesBurned = caloriesBurned;
    if (exercises !== undefined) workout.exercises = exercises;
    if (notes !== undefined) workout.notes = notes;

    await workout.save();

    res.status(200).json({ workout });
  } catch (error) {
    next(error);
  }
};

const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found or unauthorized' });
    }
    res.status(200).json({ deletedId: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
};
