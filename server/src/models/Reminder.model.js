const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  type: { type: String, enum: ['Workout', 'Meal', 'Goal', 'Hydration'], required: true },
  timeOfDay: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  daysOfWeek: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
  enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', ReminderSchema);
