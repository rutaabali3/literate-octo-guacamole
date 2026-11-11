import React from 'react';
import { Dumbbell, Clock, Flame, Tag, Trash2 } from 'lucide-react';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import { formatWeight } from '../../utils/formatUnits';

const WorkoutCard = ({ workout, onDelete }) => {
  const { unitSystem } = useThemeUnit();

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Strength': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Cardio': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'HIIT': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Mobility': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(workout.category)}`}>
              {workout.category}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(workout.performedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">{workout.title}</h3>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(workout._id)}
            title="Delete workout"
            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700/50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Duration</span>
          <span className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {workout.durationMinutes}m
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Burned</span>
          <span className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            {workout.caloriesBurned || 0}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Volume</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            {formatWeight(workout.totalVolumeKg || 0, unitSystem)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Exercise Sets</h4>
        <div className="space-y-1">
          {workout.exercises?.map((ex, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
              <span className="text-slate-200 font-medium">{ex.exerciseName}</span>
              <span className="text-slate-400 font-mono">
                {ex.sets} × {ex.reps} @ {formatWeight(ex.weightKg, unitSystem)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {workout.tags?.length > 0 && (
        <div className="flex items-center gap-1.5 mt-4 flex-wrap pt-3 border-t border-slate-800/80">
          <Tag className="w-3 h-3 text-slate-500" />
          {workout.tags.map((t, idx) => (
            <span key={idx} className="text-[11px] text-blue-400/90 font-medium">
              #{t}
            </span>
          ))}
        </div>
      )}

      {workout.notes && (
        <p className="mt-3 text-xs text-slate-400 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
          "{workout.notes}"
        </p>
      )}
    </div>
  );
};

export default WorkoutCard;
