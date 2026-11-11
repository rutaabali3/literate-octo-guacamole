const User = require('../models/User.model');
const Workout = require('../models/Workout.model');
const NutritionLog = require('../models/NutritionLog.model');
const ProgressEntry = require('../models/ProgressEntry.model');
const Reminder = require('../models/Reminder.model');
const Notification = require('../models/Notification.model');
const SupportTicket = require('../models/SupportTicket.model');

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('social.followers social.following', 'username profile.fullName profile.avatarUrl');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { fullName, bio, avatarUrl, fitnessGoal, dailyCalorieTarget, macroTargets, targetWeightKg, weeklyWorkoutGoal } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName !== undefined) user.profile.fullName = fullName;
    if (bio !== undefined) user.profile.bio = bio;
    if (avatarUrl !== undefined) user.profile.avatarUrl = avatarUrl;
    if (fitnessGoal !== undefined) user.profile.fitnessGoal = fitnessGoal;
    if (dailyCalorieTarget !== undefined) user.profile.dailyCalorieTarget = dailyCalorieTarget;
    if (targetWeightKg !== undefined) user.profile.targetWeightKg = targetWeightKg;
    if (weeklyWorkoutGoal !== undefined) user.profile.weeklyWorkoutGoal = weeklyWorkoutGoal;
    if (macroTargets) {
      user.profile.macroTargets = {
        ...user.profile.macroTargets,
        ...macroTargets
      };
    }

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { unitSystem, theme, notifications, profileVisibility, gdprConsent } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (unitSystem !== undefined) user.preferences.unitSystem = unitSystem;
    if (theme !== undefined) user.preferences.theme = theme;
    if (profileVisibility !== undefined) user.preferences.profileVisibility = profileVisibility;
    if (notifications) {
      user.preferences.notifications = {
        ...user.preferences.notifications,
        ...notifications
      };
    }
    if (gdprConsent) {
      user.preferences.gdprConsent = {
        ...user.preferences.gdprConsent,
        ...gdprConsent
      };
    }

    await user.save();
    res.status(200).json({ preferences: user.preferences });
  } catch (error) {
    next(error);
  }
};

const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target athlete not found' });
    }

    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.social.following.some(id => id.toString() === targetUserId);

    if (isFollowing) {
      currentUser.social.following = currentUser.social.following.filter(id => id.toString() !== targetUserId);
      targetUser.social.followers = targetUser.social.followers.filter(id => id.toString() !== currentUserId);
    } else {
      currentUser.social.following.push(targetUserId);
      targetUser.social.followers.push(currentUserId);

      if (targetUser.preferences?.notifications?.newFollowers !== false) {
        await Notification.create({
          userId: targetUserId,
          category: 'new_follower',
          title: 'New Follower',
          message: `${currentUser.profile.fullName || currentUser.username} started following your fitness journey!`
        });
      }
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      isFollowing: !isFollowing,
      followerCount: targetUser.social.followers.length,
      followingCount: currentUser.social.following.length
    });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Promise.all([
      User.findByIdAndDelete(userId),
      Workout.deleteMany({ userId }),
      NutritionLog.deleteMany({ userId }),
      ProgressEntry.deleteMany({ userId }),
      Reminder.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
      SupportTicket.deleteMany({ userId }),
      User.updateMany(
        { $or: [{ 'social.followers': userId }, { 'social.following': userId }] },
        { $pull: { 'social.followers': userId, 'social.following': userId } }
      )
    ]);

    res.status(200).json({ message: 'Account and associated GDPR personal data deleted permanently.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  updateMe,
  updatePreferences,
  toggleFollow,
  deleteAccount
};
