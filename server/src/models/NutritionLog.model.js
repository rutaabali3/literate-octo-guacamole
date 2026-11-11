const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0.1 },
  unit: { type: String, required: true, default: 'g' },
  calories: { type: Number, required: true, min: 0 },
  proteinGrams: { type: Number, required: true, min: 0 },
  carbsGrams: { type: Number, required: true, min: 0 },
  fatGrams: { type: Number, required: true, min: 0 }
}, { _id: false });

const NutritionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  loggedDate: { type: Date, required: true, default: Date.now, index: true },
  mealType: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    index: true
  },
  items: {
    type: [FoodItemSchema],
    validate: [arr => arr.length > 0, 'At least one food item is required']
  },
  totals: {
    calories: { type: Number, default: 0 },
    proteinGrams: { type: Number, default: 0 },
    carbsGrams: { type: Number, default: 0 },
    fatGrams: { type: Number, default: 0 }
  },
  waterMl: { type: Number, min: 0, default: 0 },
  notes: { type: String, trim: true, maxlength: 300, default: '' }
}, { timestamps: true });

NutritionLogSchema.index({ userId: 1, loggedDate: -1 });
NutritionLogSchema.index({ 'items.name': 'text', mealType: 'text', notes: 'text' });

NutritionLogSchema.pre('validate', function (next) {
  if (Array.isArray(this.items)) {
    this.totals = this.items.reduce(
      (acc, item) => ({
        calories: acc.calories + Number(item.calories || 0),
        proteinGrams: +(acc.proteinGrams + Number(item.proteinGrams || 0)).toFixed(1),
        carbsGrams: +(acc.carbsGrams + Number(item.carbsGrams || 0)).toFixed(1),
        fatGrams: +(acc.fatGrams + Number(item.fatGrams || 0)).toFixed(1)
      }),
      { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 }
    );
  }
  next();
});

module.exports = mongoose.model('NutritionLog', NutritionLogSchema);
