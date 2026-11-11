import React, { useState } from 'react';
import { X, User, Target, Dumbbell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import { formatWeight, parseWeightToKg } from '../../utils/formatUnits';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { unitSystem } = useThemeUnit();
  const [fullName, setFullName] = useState(user?.profile?.fullName || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [fitnessGoal, setFitnessGoal] = useState(user?.profile?.fitnessGoal || 'Strength & Hypertrophy');
  const [targetWeight, setTargetWeight] = useState(
    unitSystem === 'imperial'
      ? +( (user?.profile?.targetWeightKg || 75) * 2.20462).toFixed(1)
      : (user?.profile?.targetWeightKg || 75)
  );
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(user?.profile?.dailyCalorieTarget || 2400);
  const [weeklyWorkoutGoal, setWeeklyWorkoutGoal] = useState(user?.profile?.weeklyWorkoutGoal || 4);
  const [saving, setSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        fullName,
        bio,
        fitnessGoal,
        targetWeightKg: parseWeightToKg(targetWeight, unitSystem),
        dailyCalorieTarget: Number(dailyCalorieTarget),
        weeklyWorkoutGoal: Number(weeklyWorkoutGoal)
      });
      onClose();
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Athlete Profile & Goals</h2>
              <p className="text-xs text-blue-400">@{user.username}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Training Philosophy</label>
            <textarea
              rows="2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fitness Goal</label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
              >
                <option value="Strength & Hypertrophy">Strength & Hypertrophy</option>
                <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                <option value="Endurance & Marathon">Endurance & Marathon</option>
                <option value="General Wellness">General Wellness</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Calorie Target</label>
              <input
                type="number"
                value={dailyCalorieTarget}
                onChange={(e) => setDailyCalorieTarget(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Weekly Workout Goal</label>
              <input
                type="number"
                min="1"
                max="14"
                value={weeklyWorkoutGoal}
                onChange={(e) => setWeeklyWorkoutGoal(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
            >
              {saving ? 'Updating...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
