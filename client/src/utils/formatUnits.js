export const formatWeight = (kg, unitSystem = 'metric') => {
  if (kg === null || kg === undefined || isNaN(kg)) return '—';
  if (unitSystem === 'imperial') {
    const lbs = +(kg * 2.20462).toFixed(1);
    return `${lbs} lbs`;
  }
  return `${+(kg).toFixed(1)} kg`;
};

export const formatMeasurement = (cm, unitSystem = 'metric') => {
  if (cm === null || cm === undefined || isNaN(cm)) return '—';
  if (unitSystem === 'imperial') {
    const inches = +(cm * 0.393701).toFixed(1);
    return `${inches} in`;
  }
  return `${+(cm).toFixed(1)} cm`;
};

export const formatDistance = (km, unitSystem = 'metric') => {
  if (km === null || km === undefined || isNaN(km)) return '—';
  if (unitSystem === 'imperial') {
    const miles = +(km * 0.621371).toFixed(2);
    return `${miles} mi`;
  }
  return `${+(km).toFixed(2)} km`;
};

export const parseWeightToKg = (val, unitSystem = 'metric') => {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  if (unitSystem === 'imperial') {
    return +(num / 2.20462).toFixed(2);
  }
  return +(num).toFixed(2);
};

export const parseMeasurementToCm = (val, unitSystem = 'metric') => {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  if (unitSystem === 'imperial') {
    return +(num / 0.393701).toFixed(2);
  }
  return +(num).toFixed(2);
};
