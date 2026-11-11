import React from 'react';
import { useThemeUnit } from '../../context/ThemeUnitContext';
import { formatWeight, formatMeasurement } from '../../utils/formatUnits';
import { Trash2 } from 'lucide-react';

const BodyMetricsTable = ({ entries = [], onDelete }) => {
  const { unitSystem } = useThemeUnit();

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg">
      <h3 className="text-base font-bold text-white mb-4">Body Composition & Measurement Log</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Weight</th>
              <th className="py-2.5 px-3">Body Fat</th>
              <th className="py-2.5 px-3">Waist</th>
              <th className="py-2.5 px-3">Chest</th>
              <th className="py-2.5 px-3">Arms</th>
              <th className="py-2.5 px-3">Notes</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {entries.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-slate-500 italic">
                  No progress check-ins recorded yet.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-slate-750/30">
                  <td className="py-2.5 px-3 font-medium text-white whitespace-nowrap">
                    {new Date(entry.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-blue-400">
                    {formatWeight(entry.weightKg, unitSystem)}
                  </td>
                  <td className="py-2.5 px-3">{entry.bodyFatPct ? `${entry.bodyFatPct}%` : '—'}</td>
                  <td className="py-2.5 px-3">{formatMeasurement(entry.measurementsCm?.waist, unitSystem)}</td>
                  <td className="py-2.5 px-3">{formatMeasurement(entry.measurementsCm?.chest, unitSystem)}</td>
                  <td className="py-2.5 px-3">{formatMeasurement(entry.measurementsCm?.arms, unitSystem)}</td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">{entry.notes || '—'}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onDelete(entry._id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BodyMetricsTable;
