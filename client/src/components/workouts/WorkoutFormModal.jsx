import React, { useState } from 'react';
import { X, Plus, Trash2, Dumbbell } from 'lucide-react';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import { parseWeightToKg } from '../../utils/formatUnits';

const WorkoutFormModal = ({ isOpen, onClose, onSave }) => {
  const { unitSystem } = useThemeUnit();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Strength');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [caloriesBurned, setCaloriesBurned] = useState(400);
  const [tagsInput, setTagsInput] = useState('push, hypertrophy');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([
    { exerciseName: 'Barbell Bench Press', sets: 4, reps: 8, weightInput: unitSystem === 'imperial' ? 185 : 85, rpe: 8, notes: '' }
  ]);

  if (!isOpen) return null;

  const handleAddExerciseRow = () => {
    setExercises([...exercises, { exerciseName: '', sets: 3, reps: 10, weightInput: 0, rpe: 8, notes: '' }]);
  };

  const handleRemoveExerciseRow = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleExerciseChange = (idx, field, value) => {
    const updated = [...exercises];
    updated[idx][field] = value;
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a workout title');
    if (exercises.length === 0) return alert('Add at least one exercise');

    const formattedExercises = exercises.map(ex => ({
      exerciseName: ex.exerciseName || 'Exercise',
      sets: Number(ex.sets) || 1,
      reps: Number(ex.reps) || 1,
      weightKg: parseWeightToKg(ex.weightInput, unitSystem),
      rpe: Number(ex.rpe) || 8,
      notes: ex.notes || ''
    }));

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSave({
      title,
      category,
      durationMinutes: Number(durationMinutes) || 30,
      caloriesBurned: Number(caloriesBurned) || 0,
      tags,
      notes,
      exercises: formattedExercises
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Log Workout Routine</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Routine Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chest & Triceps Hypertrophy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Mobility">Mobility</option>
                <option value="CrossFit">CrossFit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (min)</label>
              <input
                type="number"
                min="1"
                max="600"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Calories Burned</label>
              <input
                type="number"
                min="0"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="push, legs, pr"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Exercise Builder */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Exercises & Sets ({unitSystem === 'imperial' ? 'Weight in LBS' : 'Weight in KG'})
              </label>
              <button
                type="button"
                onClick={handleAddExerciseRow}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exercise</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {exercises.map((ex, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <input
                    type="text"
                    required
                    placeholder="Exercise name"
                    value={ex.exerciseName}
                    onChange={(e) => handleExerciseChange(idx, 'exerciseName', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Sets"
                    title="Sets"
                    value={ex.sets}
                    onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                    className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Reps"
                    title="Reps"
                    value={ex.reps}
                    onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                    className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-white"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder={unitSystem === 'imperial' ? 'lbs' : 'kg'}
                    title={`Weight (${unitSystem === 'imperial' ? 'lbs' : 'kg'})`}
                    value={ex.weightInput}
                    onChange={(e) => handleExerciseChange(idx, 'weightInput', e.target.value)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-white font-semibold text-blue-400"
                  />
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExerciseRow(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Session Notes</label>
            <textarea
              rows="2"
              placeholder="Felt strong, good cadence on compounds..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
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
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutFormModal;
