import axios from 'axios';
import { memoryCache } from '../utils/cache.js';
import { calculateCPCB_AQI } from './cpcbCalculator.js';

const OM_AQ_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const OM_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const OM_GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Fetch air quality from Open-Meteo with CPCB AQI calculation and caching
 */
export async function getOpenMeteoAirQuality(lat, lon) {
  const cacheKey = `om_aq_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(OM_AQ_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
        timezone: 'Asia/Kolkata',
        forecast_days: 2
      },
      timeout: 6000
    });

    const hourly = response.data.hourly;
    const now = new Date();

    // Map hourly forecast array
    const forecast = [];
    const times = hourly.time || [];

    for (let i = 0; i < Math.min(times.length, 48); i++) {
      const pm25 = hourly.pm2_5?.[i] ?? 0;
      const pm10 = hourly.pm10?.[i] ?? 0;
      const no2 = hourly.nitrogen_dioxide?.[i] ?? 0;
      const so2 = hourly.sulphur_dioxide?.[i] ?? 0;
      const coUg = hourly.carbon_monoxide?.[i] ?? 0;
      const coMg = Number((coUg / 1000).toFixed(2)); // convert µg/m³ to mg/m³
      const o3 = hourly.ozone?.[i] ?? 0;

      const cpcb = calculateCPCB_AQI({
        pm25,
        pm10,
        no2,
        so2,
        co: coMg,
        o3
      });

      const dateObj = new Date(times[i]);
      forecast.push({
        timestamp: dateObj.toISOString(),
        time: dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        date: dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
        aqi: cpcb.aqi,
        category: cpcb.category,
        dominantPollutant: cpcb.dominantPollutant,
        pollutants: {
          pm25: { value: pm25, subIndex: cpcb.subIndices.pm25 || 0 },
          pm10: { value: pm10, subIndex: cpcb.subIndices.pm10 || 0 },
          no2: { value: no2, subIndex: cpcb.subIndices.no2 || 0 },
          so2: { value: so2, subIndex: cpcb.subIndices.so2 || 0 },
          co: { value: coMg, subIndex: cpcb.subIndices.co || 0 },
          o3: { value: o3, subIndex: cpcb.subIndices.o3 || 0 }
        },
        type: 'forecast',
        source: 'Open-Meteo Atmospheric Chemistry Model'
      });
    }

    // Current reading is the first forecast hour or closest to now
    const current = forecast[0] || null;

    const result = {
      current,
      forecast,
      type: 'forecast',
      source: 'Open-Meteo Atmospheric Model',
      lastUpdated: now.toISOString()
    };

    memoryCache.set(cacheKey, result, 900); // 15 min TTL
    return result;
  } catch (error) {
    console.warn('Open-Meteo AQ fetch error, returning fallback:', error.message);
    return null;
  }
}

/**
 * Fetch surface weather parameters (temperature, humidity, wind, pressure)
 */
export async function getOpenMeteoWeather(lat, lon) {
  const cacheKey = `om_weather_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(OM_WEATHER_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code',
        timezone: 'Asia/Kolkata'
      },
      timeout: 6000
    });

    const cur = response.data.current || {};
    const result = {
      temperature: Math.round(cur.temperature_2m || 24),
      humidity: Math.round(cur.relative_humidity_2m || 50),
      windSpeed: Number((cur.wind_speed_10m || 8).toFixed(1)),
      windDirection: Math.round(cur.wind_direction_10m || 0),
      pressure: Math.round(cur.surface_pressure || 1013),
      weatherCode: cur.weather_code || 0,
      condition: getConditionText(cur.weather_code || 0),
      source: 'Open-Meteo Weather Model',
      type: 'forecast',
      timestamp: new Date().toISOString()
    };

    memoryCache.set(cacheKey, result, 900);
    return result;
  } catch (error) {
    console.warn('Open-Meteo Weather fetch error:', error.message);
    return {
      temperature: 24,
      humidity: 50,
      windSpeed: 10,
      windDirection: 270,
      pressure: 1013,
      condition: 'Normal',
      source: 'Default Atmospheric Model',
      type: 'forecast',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Search Indian cities using Open-Meteo Geocoding
 */
export async function searchIndianCities(query) {
  if (!query || query.trim().length < 2) return [];

  const cacheKey = `om_geo_${query.trim().toLowerCase()}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(OM_GEOCODE_URL, {
      params: {
        name: query.trim(),
        count: 10,
        language: 'en',
        format: 'json'
      },
      timeout: 5000
    });

    const results = (response.data.results || [])
      // Prioritize/filter to India
      .filter((r) => r.country_code === 'IN' || r.country === 'India')
      .map((r) => ({
        name: r.name,
        state: r.admin1 || r.country,
        country: r.country,
        lat: r.latitude,
        lon: r.longitude,
        slug: `${r.name.toLowerCase().replace(/\s+/g, '-')}-${(r.admin1 || 'in').toLowerCase().replace(/\s+/g, '-')}`
      }));

    memoryCache.set(cacheKey, results, 3600); // 1h cache
    return results;
  } catch (error) {
    console.warn('Open-Meteo Geocoding error:', error.message);
    return [];
  }
}

function getConditionText(code) {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Hazy / Fog';
  if (code <= 67) return 'Light Rain';
  if (code <= 77) return 'Snow Flurries';
  if (code <= 99) return 'Thunderstorm';
  return 'Clear';
}
