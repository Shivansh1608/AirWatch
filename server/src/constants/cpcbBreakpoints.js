// Official Indian Central Pollution Control Board (CPCB) NAQI Breakpoints
// Concentration units: PM2.5, PM10, NO2, SO2, O3 in µg/m³; CO in mg/m³

export const CPCB_BREAKPOINTS = {
  pm25: [
    { bLow: 0, bHigh: 30, iLow: 0, iHigh: 50 },
    { bLow: 31, bHigh: 60, iLow: 51, iHigh: 100 },
    { bLow: 61, bHigh: 90, iLow: 101, iHigh: 200 },
    { bLow: 91, bHigh: 120, iLow: 201, iHigh: 300 },
    { bLow: 121, bHigh: 250, iLow: 301, iHigh: 400 },
    { bLow: 250.1, bHigh: 500, iLow: 401, iHigh: 500 }
  ],
  pm10: [
    { bLow: 0, bHigh: 50, iLow: 0, iHigh: 50 },
    { bLow: 51, bHigh: 100, iLow: 51, iHigh: 100 },
    { bLow: 101, bHigh: 250, iLow: 101, iHigh: 200 },
    { bLow: 251, bHigh: 350, iLow: 201, iHigh: 300 },
    { bLow: 351, bHigh: 430, iLow: 301, iHigh: 400 },
    { bLow: 430.1, bHigh: 600, iLow: 401, iHigh: 500 }
  ],
  no2: [
    { bLow: 0, bHigh: 40, iLow: 0, iHigh: 50 },
    { bLow: 41, bHigh: 80, iLow: 51, iHigh: 100 },
    { bLow: 81, bHigh: 180, iLow: 101, iHigh: 200 },
    { bLow: 181, bHigh: 280, iLow: 201, iHigh: 300 },
    { bLow: 281, bHigh: 400, iLow: 301, iHigh: 400 },
    { bLow: 400.1, bHigh: 600, iLow: 401, iHigh: 500 }
  ],
  so2: [
    { bLow: 0, bHigh: 40, iLow: 0, iHigh: 50 },
    { bLow: 41, bHigh: 80, iLow: 51, iHigh: 100 },
    { bLow: 81, bHigh: 380, iLow: 101, iHigh: 200 },
    { bLow: 381, bHigh: 800, iLow: 201, iHigh: 300 },
    { bLow: 801, bHigh: 1600, iLow: 301, iHigh: 400 },
    { bLow: 1600.1, bHigh: 2000, iLow: 401, iHigh: 500 }
  ],
  co: [
    { bLow: 0, bHigh: 1.0, iLow: 0, iHigh: 50 },
    { bLow: 1.1, bHigh: 2.0, iLow: 51, iHigh: 100 },
    { bLow: 2.1, bHigh: 10.0, iLow: 101, iHigh: 200 },
    { bLow: 10.1, bHigh: 17.0, iLow: 201, iHigh: 300 },
    { bLow: 17.1, bHigh: 34.0, iLow: 301, iHigh: 400 },
    { bLow: 34.1, bHigh: 50.0, iLow: 401, iHigh: 500 }
  ],
  o3: [
    { bLow: 0, bHigh: 50, iLow: 0, iHigh: 50 },
    { bLow: 51, bHigh: 100, iLow: 51, iHigh: 100 },
    { bLow: 101, bHigh: 168, iLow: 101, iHigh: 200 },
    { bLow: 169, bHigh: 208, iLow: 201, iHigh: 300 },
    { bLow: 209, bHigh: 748, iLow: 301, iHigh: 400 },
    { bLow: 748.1, bHigh: 1000, iLow: 401, iHigh: 500 }
  ]
};

export const CPCB_CATEGORIES = [
  { name: 'Good', min: 0, max: 50, color: '#00B050' },
  { name: 'Satisfactory', min: 51, max: 100, color: '#92D050' },
  { name: 'Moderate', min: 101, max: 200, color: '#FFD700' },
  { name: 'Poor', min: 201, max: 300, color: '#FF9900' },
  { name: 'Very Poor', min: 301, max: 400, color: '#FF0000' },
  { name: 'Severe', min: 401, max: Infinity, color: '#8B0000' }
];

export function getCategoryByAQI(aqi) {
  const val = Math.round(Number(aqi) || 0);
  if (val <= 50) return 'Good';
  if (val <= 100) return 'Satisfactory';
  if (val <= 200) return 'Moderate';
  if (val <= 300) return 'Poor';
  if (val <= 400) return 'Very Poor';
  return 'Severe';
}

export const getCPCBCategory = getCategoryByAQI;
