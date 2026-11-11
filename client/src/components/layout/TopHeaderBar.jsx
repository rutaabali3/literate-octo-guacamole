import React from 'react';
import { Sun, Moon, Bell, Search, Scale, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import { useAuth } from '../../context/AuthContext';
import { useFitnessData } from '../../context/FitnessDataContext';

const TopHeaderBar = ({ onOpenAuth, onOpenProfile, onToggleNotifDrawer, onQuickSearch }) => {
  const { theme, toggleTheme, unitSystem, toggleUnitSystem } = useThemeUnit();
  const { user, logout } = useAuth();
  const { unreadNotifCount } = useFitnessData();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search workouts, exercises, foods..."
            onChange={(e) => onQuickSearch && onQuickSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Unit Toggle Button */}
        <button
          onClick={toggleUnitSystem}
          title={`Switch to ${unitSystem === 'metric' ? 'Imperial (lbs/in)' : 'Metric (kg/cm)'}`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <Scale className="w-3.5 h-3.5 text-blue-400" />
          <span className="uppercase">{unitSystem}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Notifications Bell */}
        {user && (
          <button
            onClick={onToggleNotifDrawer}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Activity Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
              </span>
            )}
          </button>
        )}

        {/* User Auth Chip */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white group"
            >
              <img
                src={user.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={user.profile?.fullName || user.username}
                className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-blue-500 transition-colors"
              />
              <span className="hidden md:inline font-semibold">{user.profile?.fullName || user.username}</span>
            </button>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Demo</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default TopHeaderBar;
