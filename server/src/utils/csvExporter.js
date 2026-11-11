// server/src/utils/csvExporter.js

const generateCsvReport = (scope, data) => {
  const lines = [];

  if (scope === 'workouts' || scope === 'all') {
    lines.push('--- WORKOUTS ---');
    lines.push('ID,Title,Category,Date,DurationMinutes,CaloriesBurned,TotalVolumeKg,ExerciseCount,Notes');
    (data.workouts || []).forEach(w => {
      const exCount = w.exercises ? w.exercises.length : 0;
      const cleanNotes = (w.notes || '').replace(/"/g, '""');
      lines.push(`"${w._id}","${w.title}","${w.category}","${w.performedAt ? new Date(w.performedAt).toISOString() : ''}",${w.durationMinutes},${w.caloriesBurned || 0},${w.totalVolumeKg || 0},${exCount},"${cleanNotes}"`);
    });
    lines.push('');
  }

  if (scope === 'nutrition' || scope === 'all') {
    lines.push('--- NUTRITION LOGS ---');
    lines.push('ID,MealType,Date,Calories,ProteinGrams,CarbsGrams,FatGrams,WaterMl,Notes');
    (data.nutrition || []).forEach(n => {
      const cleanNotes = (n.notes || '').replace(/"/g, '""');
      lines.push(`"${n._id}","${n.mealType}","${n.loggedDate ? new Date(n.loggedDate).toISOString() : ''}",${n.totals?.calories || 0},${n.totals?.proteinGrams || 0},${n.totals?.carbsGrams || 0},${n.totals?.fatGrams || 0},${n.waterMl || 0},"${cleanNotes}"`);
    });
    lines.push('');
  }

  if (scope === 'progress' || scope === 'all') {
    lines.push('--- PROGRESS CHECK-INS ---');
    lines.push('ID,Date,WeightKg,BodyFatPct,WaistCm,ChestCm,ArmsCm,Bench1RMKg,Squat1RMKg,Deadlift1RMKg,Run5kMin,Notes');
    (data.progress || []).forEach(p => {
      const cleanNotes = (p.notes || '').replace(/"/g, '""');
      lines.push(`"${p._id}","${p.recordedAt ? new Date(p.recordedAt).toISOString() : ''}",${p.weightKg || ''},${p.bodyFatPct || ''},${p.measurementsCm?.waist || ''},${p.measurementsCm?.chest || ''},${p.measurementsCm?.arms || ''},${p.performanceMetrics?.benchPressMaxKg || ''},${p.performanceMetrics?.squatMaxKg || ''},${p.performanceMetrics?.deadliftMaxKg || ''},${p.performanceMetrics?.run5kTimeMinutes || ''},"${cleanNotes}"`);
    });
  }

  return lines.join('\n');
};

module.exports = {
  generateCsvReport
};
