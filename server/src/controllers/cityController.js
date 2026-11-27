import { POPULAR_INDIAN_CITIES } from '../constants/indianCities.js';
import { searchGlobalCities } from '../services/openMeteoService.js';

export async function searchCities(req, res, next) {
  try {
    const q = req.query.q || '';
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: POPULAR_INDIAN_CITIES.slice(0, 8) });
    }

    // 1. Fetch from global Geocoding API
    const remoteMatches = await searchGlobalCities(q);

    // 2. Check local list for matches
    const localMatches = POPULAR_INDIAN_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.state.toLowerCase().includes(q.toLowerCase())
    ).map(c => ({ ...c, country: 'India', countryCode: 'IN' }));

    // Merge and de-duplicate
    const seen = new Set();
    const merged = [];

    // Prioritize direct matches
    for (const item of [...remoteMatches, ...localMatches]) {
      const key = `${item.name.toLowerCase()}-${(item.countryCode || item.country || '').toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }

    return res.json({
      success: true,
      data: merged.slice(0, 12)
    });
  } catch (error) {
    next(error);
  }
}

export function getPopularCities(req, res) {
  return res.json({
    success: true,
    data: POPULAR_INDIAN_CITIES
  });
}
