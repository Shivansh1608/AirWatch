// Rich realistic mock data for Indian cities strictly adhering to CPCB breakpoints

export const INDIAN_CITIES_MOCK = [
  {
    name: 'Delhi',
    state: 'National Capital Territory',
    slug: 'delhi',
    lat: 28.6139,
    lon: 77.2090,
    aqi: 312,
    category: 'Very Poor',
    dominantPollutant: 'PM2.5',
    station: 'Anand Vihar, Delhi - DPCC',
    source: 'CPCB / DPCC Station 04',
    type: 'observed',
    timestamp: new Date().toISOString(),
    pollutants: {
      pm25: { value: 142.5, unit: 'µg/m³', subIndex: 312, category: 'Very Poor' },
      pm10: { value: 278.0, unit: 'µg/m³', subIndex: 228, category: 'Poor' },
      no2: { value: 68.4, unit: 'µg/m³', subIndex: 85, category: 'Satisfactory' },
      so2: { value: 22.1, unit: 'µg/m³', subIndex: 28, category: 'Good' },
      co: { value: 2.8, unit: 'mg/m³', subIndex: 128, category: 'Moderate' },
      o3: { value: 46.2, unit: 'µg/m³', subIndex: 46, category: 'Good' }
    },
    weather: {
      temperature: 23.4,
      humidity: 58,
      windSpeed: 8.2,
      windDirection: 290, // WNW
      pressure: 1014,
      condition: 'Hazy'
    }
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    slug: 'mumbai',
    lat: 19.0760,
    lon: 72.8777,
    aqi: 142,
    category: 'Moderate',
    dominantPollutant: 'PM10',
    station: 'Bandra Kurla Complex, Mumbai - MPCB',
    source: 'CPCB / MPCB Station 02',
    type: 'observed',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    pollutants: {
      pm25: { value: 54.0, unit: 'µg/m³', subIndex: 90, category: 'Satisfactory' },
      pm10: { value: 162.0, unit: 'µg/m³', subIndex: 142, category: 'Moderate' },
      no2: { value: 44.0, unit: 'µg/m³', subIndex: 55, category: 'Satisfactory' },
      so2: { value: 18.5, unit: 'µg/m³', subIndex: 23, category: 'Good' },
      co: { value: 1.4, unit: 'mg/m³', subIndex: 70, category: 'Satisfactory' },
      o3: { value: 38.0, unit: 'µg/m³', subIndex: 38, category: 'Good' }
    },
    weather: {
      temperature: 29.8,
      humidity: 72,
      windSpeed: 14.5,
      windDirection: 240, // WSW sea breeze
      pressure: 1011,
      condition: 'Partly Cloudy'
    }
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    slug: 'bengaluru',
    lat: 12.9716,
    lon: 77.5946,
    aqi: 48,
    category: 'Good',
    dominantPollutant: 'O3',
    station: 'BTM Layout, Bengaluru - KSPCB',
    source: 'CPCB / KSPCB Station 01',
    type: 'observed',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    pollutants: {
      pm25: { value: 18.2, unit: 'µg/m³', subIndex: 30, category: 'Good' },
      pm10: { value: 34.0, unit: 'µg/m³', subIndex: 34, category: 'Good' },
      no2: { value: 24.5, unit: 'µg/m³', subIndex: 31, category: 'Good' },
      so2: { value: 9.8, unit: 'µg/m³', subIndex: 12, category: 'Good' },
      co: { value: 0.7, unit: 'mg/m³', subIndex: 35, category: 'Good' },
      o3: { value: 48.0, unit: 'µg/m³', subIndex: 48, category: 'Good' }
    },
    weather: {
      temperature: 24.0,
      humidity: 52,
      windSpeed: 12.0,
      windDirection: 90, // East
      pressure: 1016,
      condition: 'Pleasant'
    }
  },
  {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    slug: 'lucknow',
    lat: 26.8467,
    lon: 80.9462,
    aqi: 274,
    category: 'Poor',
    dominantPollutant: 'PM2.5',
    station: 'Talkatora District Industries Center, Lucknow',
    source: 'CPCB / UPPCB Station 03',
    type: 'observed',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    pollutants: {
      pm25: { value: 112.0, unit: 'µg/m³', subIndex: 274, category: 'Poor' },
      pm10: { value: 215.0, unit: 'µg/m³', subIndex: 177, category: 'Moderate' },
      no2: { value: 52.0, unit: 'µg/m³', subIndex: 65, category: 'Satisfactory' },
      so2: { value: 14.0, unit: 'µg/m³', subIndex: 18, category: 'Good' },
      co: { value: 2.1, unit: 'mg/m³', subIndex: 101, category: 'Moderate' },
      o3: { value: 41.0, unit: 'µg/m³', subIndex: 41, category: 'Good' }
    },
    weather: {
      temperature: 22.0,
      humidity: 65,
      windSpeed: 6.0,
      windDirection: 315,
      pressure: 1015,
      condition: 'Mist'
    }
  },
  {
    name: 'Mathura',
    state: 'Uttar Pradesh',
    slug: 'mathura',
    lat: 27.4924,
    lon: 77.6737,
    aqi: 289,
    category: 'Poor',
    dominantPollutant: 'PM2.5',
    station: 'Krishna Nagar, Mathura - UPPCB',
    source: 'CPCB / UPPCB Station 01',
    type: 'observed',
    timestamp: new Date().toISOString(),
    pollutants: {
      pm25: { value: 116.8, unit: 'µg/m³', subIndex: 289, category: 'Poor' },
      pm10: { value: 242.0, unit: 'µg/m³', subIndex: 195, category: 'Moderate' },
      no2: { value: 49.0, unit: 'µg/m³', subIndex: 61, category: 'Satisfactory' },
      so2: { value: 26.0, unit: 'µg/m³', subIndex: 33, category: 'Good' },
      co: { value: 2.4, unit: 'mg/m³', subIndex: 115, category: 'Moderate' },
      o3: { value: 37.0, unit: 'µg/m³', subIndex: 37, category: 'Good' }
    },
    weather: {
      temperature: 22.5,
      humidity: 62,
      windSpeed: 7.0,
      windDirection: 300,
      pressure: 1014,
      condition: 'Hazy'
    }
  }
];

// 24-48h Hourly Forecast mock data with CPCB category mapping
export function generateHourlyForecast(baseAqi = 280) {
  const hours = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 3600000);
    // Diurnal variation: higher early morning and late night, lower afternoon
    const hourOfDay = time.getHours();
    let factor = 1.0;
    if (hourOfDay >= 22 || hourOfDay <= 8) factor = 1.18; // night inversion
    else if (hourOfDay >= 13 && hourOfDay <= 17) factor = 0.82; // solar mixing
    
    const jitter = Math.sin(i / 3) * 20;
    const aqi = Math.max(25, Math.min(480, Math.round(baseAqi * factor + jitter)));
    
    hours.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      timestamp: time.toISOString(),
      aqi,
      pm25: Math.round(aqi * 0.42),
      pm10: Math.round(aqi * 0.88),
      temp: Math.round(20 + 8 * Math.sin((hourOfDay - 6) / 24 * Math.PI * 2)),
      type: 'forecast'
    });
  }
  return hours;
}

// 7-day and 30-day historical trend
export function generateHistoricalTrend(baseAqi = 260, days = 7) {
  const trend = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    const noise = Math.sin(i * 1.5) * 45;
    const aqi = Math.max(35, Math.min(460, Math.round(baseAqi + noise)));
    
    trend.push({
      date: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      shortDate: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      aqi,
      pm25: Math.round(aqi * 0.4),
      pm10: Math.round(aqi * 0.85),
      source: 'WAQI / CPCB Historical Station Archive',
      type: 'observed'
    });
  }
  return trend;
}
