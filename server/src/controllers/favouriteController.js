import { POPULAR_INDIAN_CITIES } from '../constants/indianCities.js';
import { getWaqiStationData } from '../services/waqiService.js';
import { getOpenMeteoAirQuality } from '../services/openMeteoService.js';

// Memory store for favourites when running without MongoDB
const memoryFavourites = new Map();

export async function getFavourites(req, res, next) {
  try {
    const userId = req.user?.id || 'demo_user';
    const list = memoryFavourites.get(userId) || [
      POPULAR_INDIAN_CITIES[0], // Delhi
      POPULAR_INDIAN_CITIES[1]  // Mumbai
    ];

    // Hydrate current AQI for each favourite city
    const hydrated = await Promise.all(
      list.map(async (city) => {
        const station = await getWaqiStationData(city.lat, city.lon);
        if (station) {
          return {
            ...city,
            aqi: station.aqi,
            category: station.category,
            dominantPollutant: station.dominantPollutant,
            source: station.source,
            type: station.type,
            timestamp: station.timestamp
          };
        }
        const om = await getOpenMeteoAirQuality(city.lat, city.lon);
        return {
          ...city,
          aqi: om?.current?.aqi || 180,
          category: om?.current?.category || 'Moderate',
          dominantPollutant: om?.current?.dominantPollutant || 'PM2.5',
          source: om?.source || 'CPCB Standard',
          type: om?.type || 'forecast',
          timestamp: new Date().toISOString()
        };
      })
    );

    return res.json({
      success: true,
      data: hydrated
    });
  } catch (error) {
    next(error);
  }
}

export function addFavourite(req, res) {
  const userId = req.user?.id || 'demo_user';
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ success: false, error: { message: 'City is required' } });
  }

  const userList = memoryFavourites.get(userId) || [POPULAR_INDIAN_CITIES[0]];
  const exists = userList.find((c) => c.slug === city.slug || c.name === city.name);
  if (!exists) {
    userList.push(city);
    memoryFavourites.set(userId, userList);
  }

  return res.status(201).json({ success: true, data: userList });
}

export function removeFavourite(req, res) {
  const userId = req.user?.id || 'demo_user';
  const { slug } = req.params;

  let userList = memoryFavourites.get(userId) || [POPULAR_INDIAN_CITIES[0]];
  userList = userList.filter((c) => c.slug !== slug && c.name?.toLowerCase() !== slug?.toLowerCase());
  memoryFavourites.set(userId, userList);

  return res.json({ success: true, data: userList });
}
