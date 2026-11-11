import React from 'react';
import { Line } from 'react-chartjs-2';
import { useThemeUnit } from '../../context/ThemeUnitContext';

const WorkoutVolumeChart = ({ volumeSeries = [] }) => {
  const { unitSystem } = useThemeUnit();

  const labels = volumeSeries.map(v => v.date);
  const dataPoints = volumeSeries.map(v =>
    unitSystem === 'imperial' ? +(v.volume * 2.20462).toFixed(1) : v.volume
  );

  const data = {
    labels: labels.length > 0 ? labels : ['Day 1', 'Day 2', 'Day 3'],
    datasets: [
      {
        label: `Training Volume (${unitSystem === 'imperial' ? 'lbs' : 'kg'})`,
        data: dataPoints.length > 0 ? dataPoints : [4500, 6200, 5800],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#60a5fa',
        pointRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 12 } }
      }
    },
    scales: {
      x: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg">
      <h3 className="text-base font-bold text-white mb-2">Training Volume Progression</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WorkoutVolumeChart;
