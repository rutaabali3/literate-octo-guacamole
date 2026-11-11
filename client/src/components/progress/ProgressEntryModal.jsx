import React, { useState } from 'react';
import { X, TrendingUp, Scale, Award } from 'lucide-react';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import { parseWeightToKg, parseMeasurementToCm } from '../../utils/formatUnits';

const ProgressEntryModal = ({ isOpen, onClose, onSave }) => {
  const { unitSystem } = useThemeUnit();
  const [weightInput, setWeightInput] = useState(unitSystem === 'imperial' ? 180 : 81.5);
  const [bodyFatPct, setBodyFatPct] = useState(16.5);
  const [waistInput, setWaistInput] = useState(unitSystem === 'imperial' ? 33.5 : 85);
  const [chestInput, setChestInput] = useState(unitSystem === 'imperial' ? 42.5 : 108);
  const [armsInput, setArmsInput] = useState(unitSystem === 'imperial' ? 15.5 : 39.5);
  const [benchInput, setBenchInput] = useState(unitSystem === 'imperial' ? 225 : 102.5);
  const [squatInput, setSquatInput] = useState(unitSystem === 'imperial' ? 315 : 142.5);
  const [deadliftInput, setDeadliftInput] = useState(unitSystem === 'imperial' ? 405 : 185);
  const [run5kTime, setRun5kTime] = useState(22.5);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      weightKg: parseWeightToKg(weightInput, unitSystem),
      bodyFatPct: Number(bodyFatPct) || 0,
      measurementsCm: {
        waist: parseMeasurementToCm(waistInput, unitSystem),
        chest: parseMeasurementToCm(chestInput, unitSystem),
        arms: parseMeasurementToCm(armsInput, unitSystem)
      },
      performanceMetrics: {
        benchPressMaxKg: parseWeightToKg(benchInput, unitSystem),
        squatMaxKg: parseWeightToKg(squatInput, unitSystem),
        deadliftMaxKg: parseWeightToKg(deadliftInput, unitSystem),
        run5kTimeMinutes: Number(run5kTime) || 0
      },
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Log Body Check-In & PRs</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Body Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Body Fat %</label>
              <input
                type="number"
                step="0.1"
                value={bodyFatPct}
                onChange={(e) => setBodyFatPct(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Body Measurements ({unitSystem === 'imperial' ? 'inches' : 'cm'})
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Waist</label>
                <input
                  type="number"
                  step="0.1"
                  value={waistInput}
                  onChange={(e) => setWaistInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Chest</label>
                <input
                  type="number"
                  step="0.1"
                  value={chestInput}
                  onChange={(e) => setChestInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Arms</label>
                <input
                  type="number"
                  step="0.1"
                  value={armsInput}
                  onChange={(e) => setArmsInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Strength & Endurance PRs ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Bench 1RM</label>
                <input
                  type="number"
                  step="0.5"
                  value={benchInput}
                  onChange={(e) => setBenchInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Squat 1RM</label>
                <input
                  type="number"
                  step="0.5"
                  value={squatInput}
                  onChange={(e) => setSquatInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Deadlift 1RM</label>
                <input
                  type="number"
                  step="0.5"
                  value={deadliftInput}
                  onChange={(e) => setDeadliftInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">5K Run (min)</label>
                <input
                  type="number"
                  step="0.1"
                  value={run5kTime}
                  onChange={(e) => setRun5kTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes</label>
            <input
              type="text"
              placeholder="e.g. Weigh-in fasted in morning..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
            >
              Record Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgressEntryModal;
