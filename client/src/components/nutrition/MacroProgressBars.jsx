import React from 'react';
import { Droplet } from 'lucide-react';

const MacroProgressBars = ({ totals, targets, onLogWater }) => {
  const macros = [
    {
      name: 'Protein',
      current: totals.proteinGrams || 0,
      target: targets?.proteinGrams || 180,
      unit: 'g',
      color: 'bg-blue-500',
      textColor: 'text-blue-400'
    },
    {
      name: 'Carbs',
      current: totals.carbsGrams || 0,
      target: targets?.carbsGrams || 240,
      unit: 'g',
      color: 'bg-amber-500',
      textColor: 'text-amber-400'
    },
    {
      name: 'Fats',
      current: totals.fatGrams || 0,
      target: targets?.fatGrams || 75,
      unit: 'g',
      color: 'bg-rose-500',
      textColor: 'text-rose-400'
    }
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Daily Macro Progress</h3>
        <button
          onClick={onLogWater}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 transition-all shadow-sm"
          title="Quick log 250ml hydration"
        >
          <Droplet className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <span>+250ml Water</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {macros.map((m) => {
          const pct = Math.min(100, Math.round((m.current / m.target) * 100));
          return (
            <div key={m.name} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-300">{m.name}</span>
                <span className={`font-bold ${m.textColor}`}>
                  {m.current} / {m.target} {m.unit}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${m.color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-right text-[10px] text-slate-500 mt-1">{pct}% achieved</div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
        <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
          <Droplet className="w-4 h-4 fill-cyan-400 text-cyan-400" />
          Hydration Logged: {totals.waterMl || 0} ml
        </span>
        <span className="text-slate-400">Total Calories: <strong className="text-white">{totals.calories || 0} kcal</strong></span>
      </div>
    </div>
  );
};

export default MacroProgressBars;
