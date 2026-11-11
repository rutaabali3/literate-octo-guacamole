const mongoose = require('mongoose');

const ProgressEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recordedAt: { type: Date, required: true, default: Date.now, index: true },
  weightKg: { type: Number, required: true, min: 25, max: 350 },
  bodyFatPct: { type: Number, min: 2, max: 65 },
  measurementsCm: {
    waist: { type: Number, min: 30, max: 250 },
    chest: { type: Number, min: 40, max: 250 },
    arms: { type: Number, min: 15, max: 100 },
    thighs: { type: Number, min: 25, max: 150 }
  },
  performanceMetrics: {
    benchPressMaxKg: { type: Number, min: 0, default: 0 },
    squatMaxKg: { type: Number, min: 0, default: 0 },
    deadliftMaxKg: { type: Number, min: 0, default: 0 },
    run5kTimeMinutes: { type: Number, min: 0, default: 0 }
  },
  notes: { type: String, trim: true, maxlength: 300, default: '' }
}, { timestamps: true });

ProgressEntrySchema.index({ userId: 1, recordedAt: -1 });

module.exports = mongoose.model('ProgressEntry', ProgressEntrySchema);
