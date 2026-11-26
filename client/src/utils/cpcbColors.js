// Official Indian Central Pollution Control Board (CPCB) AQI Color Map & Helpers

export const CPCB_CATEGORIES = {
  GOOD: {
    name: 'Good',
    range: '0 - 50',
    min: 0,
    max: 50,
    color: '#00B050',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    badge: 'bg-emerald-500 text-white',
    advisoryGeneral: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    advisorySensitive: 'None. Ideal conditions for outdoor activities.'
  },
  SATISFACTORY: {
    name: 'Satisfactory',
    range: '51 - 100',
    min: 51,
    max: 100,
    color: '#92D050',
    bgLight: 'bg-lime-50 dark:bg-lime-950/40',
    border: 'border-lime-500',
    text: 'text-lime-700 dark:text-lime-400',
    badge: 'bg-lime-500 text-slate-900 font-semibold',
    advisoryGeneral: 'Air quality is acceptable. A small number of unusually sensitive people may experience minor breathing discomfort.',
    advisorySensitive: 'Sensitive individuals should consider reducing prolonged outdoor exertion.'
  },
  MODERATE: {
    name: 'Moderate',
    range: '101 - 200',
    min: 101,
    max: 200,
    color: '#FFD700',
    bgLight: 'bg-yellow-50 dark:bg-yellow-950/40',
    border: 'border-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-400',
    badge: 'bg-yellow-400 text-slate-950 font-semibold',
    advisoryGeneral: 'May cause breathing discomfort to people with lung disease such as asthma, and discomfort to people with heart disease, children and older adults.',
    advisorySensitive: 'People with respiratory or cardiac ailments should limit strenuous outdoor activities.'
  },
  POOR: {
    name: 'Poor',
    range: '201 - 300',
    min: 201,
    max: 300,
    color: '#FF9900',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-500 text-white font-semibold',
    advisoryGeneral: 'May cause breathing discomfort to people on prolonged exposure, and discomfort to people with heart disease.',
    advisorySensitive: 'Children, the elderly and individuals with lung/heart disease should avoid prolonged outdoor exertion.'
  },
  VERY_POOR: {
    name: 'Very Poor',
    range: '301 - 400',
    min: 301,
    max: 400,
    color: '#FF0000',
    bgLight: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-500',
    text: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-500 text-white font-bold',
    advisoryGeneral: 'May cause respiratory illness to the people on prolonged exposure. Effect may be more pronounced in people with lung and heart diseases.',
    advisorySensitive: 'Avoid outdoor activities. Wear N95 masks when stepping out. Keep windows closed.'
  },
  SEVERE: {
    name: 'Severe',
    range: '401 - 500+',
    min: 401,
    max: Infinity,
    color: '#8B0000',
    bgLight: 'bg-rose-100 dark:bg-rose-950/60',
    border: 'border-rose-700',
    text: 'text-rose-800 dark:text-rose-300',
    badge: 'bg-rose-800 text-white font-bold',
    advisoryGeneral: 'May cause respiratory effects even on healthy people and serious health impacts on that with lung/heart diseases. The health impacts may be experienced even during light physical work.',
    advisorySensitive: 'Emergency condition. Everyone should avoid outdoor physical exertion. Use HEPA air purifiers indoors.'
  }
};

export function getCPCBCategory(aqi) {
  const value = Math.round(Number(aqi) || 0);
  if (value <= 50) return CPCB_CATEGORIES.GOOD;
  if (value <= 100) return CPCB_CATEGORIES.SATISFACTORY;
  if (value <= 200) return CPCB_CATEGORIES.MODERATE;
  if (value <= 300) return CPCB_CATEGORIES.POOR;
  if (value <= 400) return CPCB_CATEGORIES.VERY_POOR;
  return CPCB_CATEGORIES.SEVERE;
}
