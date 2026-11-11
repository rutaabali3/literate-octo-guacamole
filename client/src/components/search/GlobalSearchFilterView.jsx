import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, Dumbbell, Utensils, Users } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import WorkoutCard from '../workouts/WorkoutCard';

const GlobalSearchFilterView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scope, setScope] = useState('all');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState({ workouts: [], nutrition: [], users: [] });
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/search', {
        params: { q: searchTerm, scope, category: category || undefined }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, scope, category]);

  const handleToggleFollow = async (userId) => {
    try {
      const res = await axiosClient.post(`/users/${userId}/follow`);
      setResults(prev => ({
        ...prev,
        users: prev.users.map(u => u._id === userId ? { ...u, isFollowing: res.data.isFollowing } : u)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          <span>Global Search & Athlete Community</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search routines, meals, tags (#push, #hypertrophy), athletes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white flex-1 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Scopes</option>
              <option value="workouts">Workouts</option>
              <option value="nutrition">Nutrition</option>
              <option value="users">Athletes</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white flex-1 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="HIIT">HIIT</option>
              <option value="Mobility">Mobility</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <p className="text-center text-sm text-slate-400 py-6">Searching records...</p>}

      {/* Athletes Feed */}
      {(scope === 'all' || scope === 'users') && results.users.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Athletes Directory ({results.users.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.users.map((u) => (
              <div key={u._id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={u.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                    alt={u.username}
                    className="w-12 h-12 rounded-full object-cover border border-slate-600"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{u.profile?.fullName || u.username}</h4>
                    <p className="text-xs text-blue-400">@{u.username}</p>
                    <p className="text-[11px] text-slate-400 truncate">{u.profile?.fitnessGoal}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFollow(u._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                    u.isFollowing
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/30'
                  }`}
                >
                  {u.isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>{u.isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workouts Feed */}
      {(scope === 'all' || scope === 'workouts') && results.workouts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-blue-400" />
            <span>Matching Workouts ({results.workouts.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.workouts.map(w => (
              <WorkoutCard key={w._id} workout={w} />
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Feed */}
      {(scope === 'all' || scope === 'nutrition') && results.nutrition.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>Matching Nutrition Logs ({results.nutrition.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.nutrition.map(n => (
              <div key={n._id} className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-semibold text-emerald-400">{n.mealType}</span>
                <p className="text-sm font-bold text-white mt-1">
                  {n.items?.map(i => i.name).join(', ')}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {n.totals?.calories} kcal • P: {n.totals?.proteinGrams}g, C: {n.totals?.carbsGrams}g, F: {n.totals?.fatGrams}g
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearchFilterView;
