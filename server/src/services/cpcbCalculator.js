import { CPCB_BREAKPOINTS, getCategoryByAQI } from '../constants/cpcbBreakpoints.js';

/**
 * Calculates the CPCB sub-index for an individual pollutant concentration.
 * @param {string} pollutant - 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3'
 * @param {number} concentration - raw concentration value
 * @returns {number|null} sub-index rounded to nearest integer, or null if invalid
 */
export function calculateSubIndex(pollutant, concentration) {
  if (concentration === null || concentration === undefined || isNaN(concentration)) {
    return null;
  }

  const c = Number(concentration);
  if (c <= 0) return 0;

  const breakpoints = CPCB_BREAKPOINTS[pollutant.toLowerCase()];
  if (!breakpoints || breakpoints.length === 0) {
    return null;
  }

  // Find matching breakpoint range
  for (let i = 0; i < breakpoints.length; i++) {
    const { bLow, bHigh, iLow, iHigh } = breakpoints[i];

    if (c >= bLow && c <= bHigh) {
      const subIndex = ((iHigh - iLow) / (bHigh - bLow)) * (c - bLow) + iLow;
      return Math.round(subIndex);
    }
  }

  // If concentration exceeds the highest breakpoint range (Severe++)
  const last = breakpoints[breakpoints.length - 1];
  if (c > last.bHigh) {
    // Linear extrapolation beyond top breakpoint, capped at 500 max per standard
    const extrapolated = ((last.iHigh - last.iLow) / (last.bHigh - last.bLow)) * (c - last.bLow) + last.iLow;
    return Math.min(500, Math.round(extrapolated));
  }

  return 0;
}

/**
 * Calculates the overall Indian CPCB AQI from a map of pollutant concentrations.
 * CPCB Method:
 * 1. Calculate sub-index for each monitored pollutant.
 * 2. Overall AQI = maximum of the sub-indices.
 * 3. Dominant pollutant = pollutant corresponding to the maximum sub-index.
 *
 * @param {Object} pollutants - { pm25, pm10, no2, so2, co, o3 }
 * @returns {Object} { aqi, category, dominantPollutant, subIndices }
 */
export function calculateCPCB_AQI(pollutants = {}) {
  const supported = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'];
  const subIndices = {};

  let maxSubIndex = 0;
  let dominantPollutant = 'PM2.5';
  let validCount = 0;

  for (const p of supported) {
    const rawVal = pollutants[p] ?? pollutants[p.toUpperCase()];
    if (rawVal !== undefined && rawVal !== null && !isNaN(rawVal)) {
      const idx = calculateSubIndex(p, Number(rawVal));
      if (idx !== null) {
        subIndices[p] = idx;
        validCount++;
        if (idx > maxSubIndex) {
          maxSubIndex = idx;
          dominantPollutant = p.toUpperCase();
        }
      }
    }
  }

  // If no valid pollutants could be computed
  if (validCount === 0) {
    return {
      aqi: 0,
      category: 'Good',
      dominantPollutant: 'None',
      subIndices: {}
    };
  }

  const category = getCategoryByAQI(maxSubIndex);

  return {
    aqi: maxSubIndex,
    category,
    dominantPollutant,
    subIndices
  };
}
