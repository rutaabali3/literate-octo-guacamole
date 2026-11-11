import React from 'react';
import { Dumbbell, Utensils, Calendar } from 'lucide-react';

const RecentActivityTimeline = ({ recentWorkouts = [], todayNutrition = [] }) => {
  const combined = [
    ...recentWorkouts.map(w => ({
      type: 'workout',
      id: w._id,
      title: w.title,
      subtitle: `${w.category} • ${w.exercises?.length || 0} exercises • ${w.totalVolumeKg || 0} kg vol`,
      date: new Date(w.performedAt),
      calories: w.caloriesBurned ? `-${w.caloriesBurned} kcal` : null
    })),
    ...todayNutrition.map(n => ({
      type: 'nutrition',
      id: n._id,
      title: `${n.mealType} Log`,
      subtitle: `${n.items?.map(i => i.name).join(', ') || 'Meals logged'}`,
      date: new Date(n.loggedDate),
      calories: `+${n.totals?.calories || 0} kcal`
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>Recent Activity Stream</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">{combined.length} activities</span>
      </div>

      <div className="space-y-3">
        {combined.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No recent activities found.</p>
        ) : (
          combined.map((act) => (
            <div
              key={`${act.type}-${act.id}`}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    act.type === 'workout'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {act.type === 'workout' ? <Dumbbell className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{act.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{act.subtitle}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                {act.calories && (
                  <span
                    className={`text-xs font-bold ${
                      act.type === 'workout' ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {act.calories}
                  </span>
                )}
                <span className="text-[10px] text-slate-500 block">
                  {act.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivityTimeline;
