import React from 'react';
import { Award, Zap, Timer } from 'lucide-react';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import { formatWeight } from '../../utils/formatUnits';

const PersonalRecordsGrid = ({ prSummary, latestMetrics }) => {
  const { unitSystem } = useThemeUnit();

  const cards = [
    {
      title: 'Bench Press 1RM',
      value: formatWeight(prSummary?.benchPressMaxKg || latestMetrics?.benchPressMaxKg || 0, unitSystem),
      category: 'Push Power',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Back Squat 1RM',
      value: formatWeight(prSummary?.squatMaxKg || latestMetrics?.squatMaxKg || 0, unitSystem),
      category: 'Leg Drive',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      title: 'Deadlift 1RM',
      value: formatWeight(prSummary?.deadliftMaxKg || latestMetrics?.deadliftMaxKg || 0, unitSystem),
      category: 'Posterior Chain',
      color: 'from-orange-600 to-amber-600'
    },
    {
      title: '5K Run Best',
      value: `${prSummary?.run5kBestMinutes || latestMetrics?.run5kTimeMinutes || 0} min`,
      category: 'Aerobic Base',
      color: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{c.category}</span>
            <Award className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">{c.title}</h4>
          <p className="text-xl font-black text-white mt-2">{c.value}</p>
        </div>
      ))}
    </div>
  );
};

export default PersonalRecordsGrid;
