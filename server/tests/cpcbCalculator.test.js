import { describe, it, expect } from 'vitest';
import { calculateSubIndex, calculateCPCB_AQI } from '../src/services/cpcbCalculator.js';

describe('CPCB AQI Calculator - Sub-Index Unit Tests', () => {
  it('should correctly calculate PM2.5 sub-indices across all CPCB breakpoints', () => {
    // Good (0-30 -> 0-50)
    expect(calculateSubIndex('pm25', 0)).toBe(0);
    expect(calculateSubIndex('pm25', 15)).toBe(25);
    expect(calculateSubIndex('pm25', 30)).toBe(50);

    // Satisfactory (31-60 -> 51-100)
    expect(calculateSubIndex('pm25', 31)).toBe(51);
    expect(calculateSubIndex('pm25', 60)).toBe(100);

    // Moderate (61-90 -> 101-200)
    expect(calculateSubIndex('pm25', 61)).toBe(101);
    expect(calculateSubIndex('pm25', 75.5)).toBe(151); // 101 + (99/29)*14.5 = 150.5 -> 151
    expect(calculateSubIndex('pm25', 90)).toBe(200);

    // Poor (91-120 -> 201-300)
    expect(calculateSubIndex('pm25', 91)).toBe(201);
    expect(calculateSubIndex('pm25', 120)).toBe(300);

    // Very Poor (121-250 -> 301-400)
    expect(calculateSubIndex('pm25', 121)).toBe(301);
    expect(calculateSubIndex('pm25', 250)).toBe(400);

    // Severe (250+ -> 401-500)
    expect(calculateSubIndex('pm25', 300)).toBe(421);
    expect(calculateSubIndex('pm25', 600)).toBe(500); // capped at 500
  });

  it('should correctly calculate PM10 sub-indices across breakpoints', () => {
    // 0-50 -> 0-50
    expect(calculateSubIndex('pm10', 25)).toBe(25);
    expect(calculateSubIndex('pm10', 50)).toBe(50);
    // 51-100 -> 51-100
    expect(calculateSubIndex('pm10', 75)).toBe(75);
    // 101-250 -> 101-200
    expect(calculateSubIndex('pm10', 250)).toBe(200);
  });

  it('should correctly calculate CO sub-indices (mg/m³ scale)', () => {
    expect(calculateSubIndex('co', 0.5)).toBe(25);
    expect(calculateSubIndex('co', 1.0)).toBe(50);
    expect(calculateSubIndex('co', 2.0)).toBe(100);
    expect(calculateSubIndex('co', 10.0)).toBe(200);
  });

  it('should handle negative, null, undefined or zero concentrations gracefully', () => {
    expect(calculateSubIndex('pm25', -10)).toBe(0);
    expect(calculateSubIndex('pm25', null)).toBeNull();
    expect(calculateSubIndex('pm25', undefined)).toBeNull();
    expect(calculateSubIndex('pm25', NaN)).toBeNull();
  });
});

describe('CPCB AQI Calculator - Overall AQI & Dominant Pollutant', () => {
  it('should take the maximum sub-index as overall AQI and identify dominant pollutant', () => {
    const reading = {
      pm25: 110, // Poor: ~266
      pm10: 60,  // Satisfactory: 60
      no2: 25,   // Good: ~31
      so2: 10,   // Good: ~12
      co: 0.8,   // Good: 40
      o3: 40     // Good: 40
    };

    const result = calculateCPCB_AQI(reading);
    expect(result.aqi).toBe(266);
    expect(result.category).toBe('Poor');
    expect(result.dominantPollutant).toBe('PM25');
    expect(result.subIndices.pm25).toBe(266);
  });

  it('should correctly assign Severe category when PM2.5 is above 250 µg/m³', () => {
    const reading = {
      pm25: 280,
      pm10: 380,
      no2: 120
    };

    const result = calculateCPCB_AQI(reading);
    expect(result.aqi).toBeGreaterThanOrEqual(401);
    expect(result.category).toBe('Severe');
    expect(result.dominantPollutant).toBe('PM25');
  });

  it('should identify PM10 as dominant when PM10 sub-index exceeds PM2.5', () => {
    const reading = {
      pm25: 25,  // sub-index: ~42
      pm10: 200, // sub-index: ~167
      no2: 30
    };

    const result = calculateCPCB_AQI(reading);
    expect(result.aqi).toBe(167);
    expect(result.category).toBe('Moderate');
    expect(result.dominantPollutant).toBe('PM10');
  });

  it('should handle empty reading object without crashing', () => {
    const result = calculateCPCB_AQI({});
    expect(result.aqi).toBe(0);
    expect(result.category).toBe('Good');
    expect(result.dominantPollutant).toBe('None');
  });
});
