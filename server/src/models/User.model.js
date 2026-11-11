const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  profile: {
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
    bio: { type: String, maxlength: 280, default: '' },
    fitnessGoal: {
      type: String,
      enum: ['Strength & Hypertrophy', 'Fat Loss & Conditioning', 'Endurance & Marathon', 'General Wellness'],
      default: 'Strength & Hypertrophy'
    },
    targetWeightKg: { type: Number, min: 30, max: 300, default: 75 },
    dailyCalorieTarget: { type: Number, min: 1000, max: 6000, default: 2400 },
    macroTargets: {
      proteinGrams: { type: Number, default: 180 },
      carbsGrams: { type: Number, default: 240 },
      fatGrams: { type: Number, default: 75 }
    },
    weeklyWorkoutGoal: { type: Number, min: 1, max: 14, default: 4 }
  },
  preferences: {
    unitSystem: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    profileVisibility: { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
    notifications: {
      workoutCompletion: { type: Boolean, default: true },
      goalAchievement: { type: Boolean, default: true },
      newFollowers: { type: Boolean, default: true },
      forumResponses: { type: Boolean, default: true },
      remindersEnabled: { type: Boolean, default: true }
    },
    gdprConsent: {
      accepted: { type: Boolean, required: true, default: true },
      acceptedAt: { type: Date, default: Date.now }
    }
  },
  social: {
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
}, { timestamps: true });

UserSchema.index({ 'profile.fullName': 'text', username: 'text', 'profile.fitnessGoal': 'text' });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
