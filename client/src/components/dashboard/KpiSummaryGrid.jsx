import React from 'react';
import { Flame, Dumbbell, Calendar, Scale } from 'lucide-react';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import { formatWeight } from '../../utils/formatUnits';

const KpiSummaryGrid = ({ kpis }) => {
  const { unitSystem } = useThemeUnit();

  if (!kpis) return null;

  const cards = [
    {
      title: "Today's Calories",
      value: `${kpis.todayCalories || 0} kcal`,
      target: `Target: ${kpis.calorieTarget || 2400} kcal`,
      pct: Math.min(100, Math.round(((kpis.todayCalories || 0) / (kpis.calorieTarget || 2400)) * 100)),
      color: 'from-orange-500 to-amber-500',
      icon: Flame
    },
    {
      title: "Weekly Volume",
      value: formatWeight(kpis.weeklyVolumeKg || 0, unitSystem),
      target: "Lifting volume (7d)",
      color: 'from-blue-500 to-cyan-500',
      icon: Dumbbell
    },
    {
      title: "Weekly Workouts",
      value: `${kpis.weeklyWorkoutsCount || 0} / ${kpis.weeklyWorkoutGoal || 4}`,
      target: `${kpis.weeklyWorkoutsCount >= kpis.weeklyWorkoutGoal ? 'Goal Achieved!' : 'Sessions completed'}`,
      pct: Math.min(100, Math.round(((kpis.weeklyWorkoutsCount || 0) / (kpis.weeklyWorkoutGoal || 4)) * 100)),
      color: 'from-emerald-500 to-teal-500',
      icon: Calendar
    },
    {
      title: "Active Weight",
      value: formatWeight(kpis.currentWeightKg || 75, unitSystem),
      target: `Goal: ${formatWeight(kpis.targetWeightKg || 75, unitSystem)}`,
      color: 'from-purple-500 to-pink-500',
      icon: Scale
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.title}</span>
              <div className={`p-2 rounded-xl bg-gradient-to-tr ${c.color} text-white shadow-md`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-white">{c.value}</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">{c.target}</p>
            </div>
            {c.pct !== undefined && (
              <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${c.color} rounded-full transition-all duration-500`}
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KpiSummaryGrid;
