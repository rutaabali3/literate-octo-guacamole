const Workout = require('../models/Workout.model');
const NutritionLog = require('../models/NutritionLog.model');
const User = require('../models/User.model');

const search = async (req, res, next) => {
  try {
    const { q = '', scope = 'all', category, tag, limit = 20 } = req.query;
    const currentUserId = req.user.id;

    let workouts = [];
    let nutrition = [];
    let users = [];

    if (scope === 'all' || scope === 'workouts') {
      const workoutFilter = { userId: currentUserId };
      if (q) {
        workoutFilter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { 'exercises.exerciseName': { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } },
          { notes: { $regex: q, $options: 'i' } }
        ];
      }
      if (category) {
        workoutFilter.category = category;
      }
      if (tag) {
        workoutFilter.tags = { $in: [tag.toLowerCase()] };
      }
      workouts = await Workout.find(workoutFilter).sort({ performedAt: -1 }).limit(parseInt(limit, 10)).lean();
    }

    if (scope === 'all' || scope === 'nutrition') {
      const nutritionFilter = { userId: currentUserId };
      if (q) {
        nutritionFilter.$or = [
          { 'items.name': { $regex: q, $options: 'i' } },
          { mealType: { $regex: q, $options: 'i' } },
          { notes: { $regex: q, $options: 'i' } }
        ];
      }
      nutrition = await NutritionLog.find(nutritionFilter).sort({ loggedDate: -1 }).limit(parseInt(limit, 10)).lean();
    }

    if (scope === 'all' || scope === 'users') {
      const userFilter = {
        _id: { $ne: currentUserId },
        'preferences.profileVisibility': { $ne: 'private' }
      };
      if (q) {
        userFilter.$or = [
          { username: { $regex: q, $options: 'i' } },
          { 'profile.fullName': { $regex: q, $options: 'i' } },
          { 'profile.fitnessGoal': { $regex: q, $options: 'i' } }
        ];
      }
      const rawUsers = await User.find(userFilter)
        .select('username profile social preferences.profileVisibility createdAt')
        .limit(parseInt(limit, 10))
        .lean();

      users = rawUsers.map(u => ({
        ...u,
        isFollowing: (u.social?.followers || []).some(id => id.toString() === currentUserId),
        followersCount: u.social?.followers?.length || 0,
        followingCount: u.social?.following?.length || 0
      }));
    }

    res.status(200).json({
      workouts,
      nutrition,
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search
};
