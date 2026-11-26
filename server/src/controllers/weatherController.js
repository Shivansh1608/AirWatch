import { getOpenMeteoWeather } from '../services/openMeteoService.js';
import { POPULAR_INDIAN_CITIES } from '../constants/indianCities.js';

export async function getWeather(req, res, next) {
  try {
    let { lat, lon, city } = req.query;

    if (city && (!lat || !lon)) {
      const match = POPULAR_INDIAN_CITIES.find(
        (c) => c.slug.toLowerCase() === city.toLowerCase() || c.name.toLowerCase() === city.toLowerCase()
      );
      lat = match?.lat || 28.6139;
      lon = match?.lon || 77.2090;
    } else {
      lat = parseFloat(lat) || 28.6139;
      lon = parseFloat(lon) || 77.2090;
    }

    const weather = await getOpenMeteoWeather(lat, lon);
    return res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    next(error);
  }
}
