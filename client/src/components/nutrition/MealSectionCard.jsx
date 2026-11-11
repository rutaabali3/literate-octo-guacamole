import React from 'react';
import { Plus, Trash2, Utensils } from 'lucide-react';

const MealSectionCard = ({ mealType, logs = [], onAddMeal, onDeleteLog }) => {
  const mealLogs = logs.filter(l => l.mealType === mealType);
  const totalCalories = mealLogs.reduce((sum, l) => sum + (l.totals?.calories || 0), 0);
  const totalProtein = mealLogs.reduce((sum, l) => sum + (l.totals?.proteinGrams || 0), 0);
  const totalCarbs = mealLogs.reduce((sum, l) => sum + (l.totals?.carbsGrams || 0), 0);
  const totalFat = mealLogs.reduce((sum, l) => sum + (l.totals?.fatGrams || 0), 0);

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>{mealType}</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {totalCalories} kcal • P: {totalProtein}g • C: {totalCarbs}g • F: {totalFat}g
          </span>
        </div>
        <button
          onClick={() => onAddMeal(mealType)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {mealLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center italic">No items logged for {mealType}.</p>
        ) : (
          mealLogs.map((log) => (
            <div
              key={log._id}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="min-w-0 pr-2">
                <div className="font-semibold text-slate-200 truncate">
                  {log.items?.map(i => `${i.name} (${i.quantity}${i.unit})`).join(', ')}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {log.totals?.calories} kcal • P: {log.totals?.proteinGrams}g, C: {log.totals?.carbsGrams}g, F: {log.totals?.fatGrams}g
                </div>
              </div>
              <button
                onClick={() => onDeleteLog(log._id)}
                className="text-slate-500 hover:text-red-400 p-1 rounded shrink-0"
                title="Delete meal entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MealSectionCard;
