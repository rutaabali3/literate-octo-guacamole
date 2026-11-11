import React, { useState } from 'react';
import { Settings, Shield, Bell, Moon, Sun, Scale, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import axiosClient from '../../api/axiosClient';

const PreferencesPanel = () => {
  const { user, setUser, logout } = useAuth();
  const { theme, toggleTheme, unitSystem, toggleUnitSystem } = useThemeUnit();
  const [profileVisibility, setProfileVisibility] = useState(user?.preferences?.profileVisibility || 'public');
  const [notifs, setNotifs] = useState(user?.preferences?.notifications || {
    workoutCompletion: true,
    goalAchievement: true,
    newFollowers: true
  });
  const [message, setMessage] = useState('');

  const handleSavePreferences = async () => {
    try {
      const res = await axiosClient.patch('/users/me/preferences', {
        profileVisibility,
        notifications: notifs
      });
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save preferences.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account and all GDPR personal data? This action cannot be reversed.')) {
      try {
        await axiosClient.delete('/users/me');
        alert('Account deleted successfully.');
        logout();
      } catch (err) {
        alert('Account deletion failed.');
      }
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <span>User Preferences & GDPR Controls</span>
        </h3>
        {message && <span className="text-xs text-emerald-400 font-semibold">{message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Units and Theme */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display & Unit Defaults</h4>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <p className="text-sm font-semibold text-white">Unit System</p>
              <p className="text-xs text-slate-400">Current: {unitSystem === 'metric' ? 'Metric (kg / cm / km)' : 'Imperial (lbs / in / mi)'}</p>
            </div>
            <button
              onClick={toggleUnitSystem}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white"
            >
              Toggle to {unitSystem === 'metric' ? 'Imperial' : 'Metric'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <p className="text-sm font-semibold text-white">Interface Theme</p>
              <p className="text-xs text-slate-400">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700"
            >
              Toggle to {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Privacy & Notifications */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Privacy & Notifications</h4>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Visibility</label>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="public">Public (Visible to all athletes)</option>
                <option value="followers">Followers Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <span>Workout Completion Alerts</span>
              <input
                type="checkbox"
                checked={notifs.workoutCompletion}
                onChange={(e) => setNotifs({ ...notifs, workoutCompletion: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>PR & Goal Achievement Alerts</span>
              <input
                type="checkbox"
                checked={notifs.goalAchievement}
                onChange={(e) => setNotifs({ ...notifs, goalAchievement: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-500/30 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account (GDPR)</span>
        </button>

        <button
          onClick={handleSavePreferences}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesPanel;
