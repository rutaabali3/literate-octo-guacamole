import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const MacroDistributionChart = ({ macroSplit }) => {
  const protein = macroSplit?.proteinGrams || 180;
  const carbs = macroSplit?.carbsGrams || 240;
  const fat = macroSplit?.fatGrams || 75;

  const data = {
    labels: ['Protein', 'Carbohydrates', 'Fats'],
    datasets: [
      {
        data: [protein, carbs, fat],
        backgroundColor: ['#3b82f6', '#f59e0b', '#f43f5e'],
        borderWidth: 2,
        borderColor: '#1e293b'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', boxWidth: 12 }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg flex flex-col">
      <h3 className="text-base font-bold text-white mb-2">Macro Distribution Ratio</h3>
      <div className="h-64 flex-1 relative flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default MacroDistributionChart;
