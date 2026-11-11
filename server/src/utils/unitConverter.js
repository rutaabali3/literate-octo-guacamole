// server/src/utils/unitConverter.js

const KG_TO_LBS = 2.20462;
const CM_TO_IN = 0.393701;
const KM_TO_MI = 0.621371;

const kgToLbs = (kg) => (kg ? +(kg * KG_TO_LBS).toFixed(1) : 0);
const lbsToKg = (lbs) => (lbs ? +(lbs / KG_TO_LBS).toFixed(1) : 0);

const cmToIn = (cm) => (cm ? +(cm * CM_TO_IN).toFixed(1) : 0);
const inToCm = (inches) => (inches ? +(inches / CM_TO_IN).toFixed(1) : 0);

const kmToMi = (km) => (km ? +(km * KM_TO_MI).toFixed(2) : 0);
const miToKm = (mi) => (mi ? +(mi / KM_TO_MI).toFixed(2) : 0);

module.exports = {
  KG_TO_LBS,
  CM_TO_IN,
  KM_TO_MI,
  kgToLbs,
  lbsToKg,
  cmToIn,
  inToCm,
  kmToMi,
  miToKm
};
