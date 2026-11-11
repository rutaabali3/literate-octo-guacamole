import React, { useState } from 'react';
import { X, Plus, Trash2, Utensils } from 'lucide-react';

const MealLogModal = ({ isOpen, initialMealType = 'Breakfast', onClose, onSave }) => {
  const [mealType, setMealType] = useState(initialMealType);
  const [waterMl, setWaterMl] = useState(250);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { name: 'Oatmeal & Protein Scoop', quantity: 100, unit: 'g', calories: 380, proteinGrams: 28, carbsGrams: 54, fatGrams: 6 }
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 100, unit: 'g', calories: 150, proteinGrams: 10, carbsGrams: 20, fatGrams: 4 }]);
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) return alert('Add at least one food item');

    const formattedItems = items.map(item => ({
      name: item.name || 'Food Item',
      quantity: Number(item.quantity) || 100,
      unit: item.unit || 'g',
      calories: Number(item.calories) || 0,
      proteinGrams: Number(item.proteinGrams) || 0,
      carbsGrams: Number(item.carbsGrams) || 0,
      fatGrams: Number(item.fatGrams) || 0
    }));

    onSave({
      mealType,
      waterMl: Number(waterMl) || 0,
      notes,
      items: formattedItems
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Utensils className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Log Nutrition & Macros</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meal Category</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Water Intake (ml)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={waterMl}
                onChange={(e) => setWaterMl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Food Items & Macros
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Food</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 items-center">
                  <div className="col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Food name"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      title="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1.5 text-xs text-center text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Kcal"
                      title="Calories"
                      value={item.calories}
                      onChange={(e) => handleItemChange(idx, 'calories', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1.5 text-xs text-center text-amber-400 font-bold"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="P(g)"
                      title="Protein"
                      value={item.proteinGrams}
                      onChange={(e) => handleItemChange(idx, 'proteinGrams', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-1 py-1.5 text-xs text-center text-blue-400"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="C(g)"
                      title="Carbs"
                      value={item.carbsGrams}
                      onChange={(e) => handleItemChange(idx, 'carbsGrams', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-1 py-1.5 text-xs text-center text-amber-300"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="F(g)"
                      title="Fat"
                      value={item.fatGrams}
                      onChange={(e) => handleItemChange(idx, 'fatGrams', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-1 py-1.5 text-xs text-center text-rose-400"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meal Notes</label>
            <input
              type="text"
              placeholder="e.g. Post-workout recovery shake + lunch..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              Save Meal Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealLogModal;
