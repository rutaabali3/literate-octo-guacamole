import React from 'react';
import { Line } from 'react-chartjs-2';
import { useThemeUnit } from '../../context/ThemeUnitContext';

const BodyCompositionChart = ({ weightSeries = [] }) => {
  const { unitSystem } = useThemeUnit();

  const labels = weightSeries.map(w => w.date);
  const weights = weightSeries.map(w =>
    unitSystem === 'imperial' ? +(w.weightKg * 2.20462).toFixed(1) : w.weightKg
  );
  const bench = weightSeries.map(w =>
    unitSystem === 'imperial' ? +( (w.benchPressMaxKg || 0) * 2.20462).toFixed(1) : (w.benchPressMaxKg || 0)
  );

  const data = {
    labels: labels.length > 0 ? labels : ['Week 1', 'Week 2', 'Week 3'],
    datasets: [
      {
        label: `Body Weight (${unitSystem === 'imperial' ? 'lbs' : 'kg'})`,
        data: weights.length > 0 ? weights : [82, 81.5, 80.8],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        yAxisID: 'y',
        tension: 0.3
      },
      {
        label: `Bench 1RM (${unitSystem === 'imperial' ? 'lbs' : 'kg'})`,
        data: bench.length > 0 ? bench : [100, 102.5, 105],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        yAxisID: 'y',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8' } }
    },
    scales: {
      x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg">
      <h3 className="text-base font-bold text-white mb-2">Weight Delta & Bench 1RM Trend</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default BodyCompositionChart;
