const mongoose = require('mongoose');

const ExerciseSetSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true, trim: true },
  sets: { type: Number, required: true, min: 1, max: 50 },
  reps: { type: Number, required: true, min: 1, max: 500 },
  weightKg: { type: Number, required: true, min: 0, max: 1000 },
  rpe: { type: Number, min: 1, max: 10, default: 8 },
  notes: { type: String, trim: true, maxlength: 200, default: '' }
}, { _id: false });

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  category: {
    type: String,
    required: true,
    enum: ['Strength', 'Cardio', 'HIIT', 'Mobility', 'CrossFit'],
    index: true
  },
  tags: [{ type: String, trim: true, lowercase: true }],
  performedAt: { type: Date, required: true, default: Date.now, index: true },
  durationMinutes: { type: Number, required: true, min: 1, max: 600 },
  caloriesBurned: { type: Number, min: 0, default: 0 },
  totalVolumeKg: { type: Number, min: 0, default: 0 },
  exercises: {
    type: [ExerciseSetSchema],
    validate: [arr => arr.length > 0, 'At least one exercise is required']
  },
  notes: { type: String, trim: true, maxlength: 500, default: '' },
  completed: { type: Boolean, default: true }
}, { timestamps: true });

WorkoutSchema.index({ userId: 1, performedAt: -1 });
WorkoutSchema.index({ title: 'text', tags: 'text', 'exercises.exerciseName': 'text', notes: 'text' });

WorkoutSchema.pre('validate', function (next) {
  if (Array.isArray(this.exercises)) {
    this.totalVolumeKg = this.exercises.reduce(
      (sum, ex) => sum + (Number(ex.sets || 0) * Number(ex.reps || 0) * Number(ex.weightKg || 0)),
      0
    );
  }
  next();
});

module.exports = mongoose.model('Workout', WorkoutSchema);
