import { POPULAR_INDIAN_CITIES } from '../constants/indianCities.js';
import { searchIndianCities } from '../services/openMeteoService.js';

export async function searchCities(req, res, next) {
  try {
    const q = req.query.q || '';
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: POPULAR_INDIAN_CITIES.slice(0, 8) });
    }

    // 1. Check local pre-seeded list first
    const localMatches = POPULAR_INDIAN_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.state.toLowerCase().includes(q.toLowerCase())
    );

    // 2. Fetch from Open-Meteo Geocoding
    const remoteMatches = await searchIndianCities(q);

    // Merge and de-duplicate by name
    const seen = new Set();
    const merged = [];

    for (const item of [...localMatches, ...remoteMatches]) {
      const key = `${item.name.toLowerCase()}-${(item.state || '').toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }

    return res.json({
      success: true,
      data: merged.slice(0, 10)
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
