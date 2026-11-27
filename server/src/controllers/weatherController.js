import { getOpenMeteoWeather, geocodeCity } from '../services/openMeteoService.js';

export async function getWeather(req, res, next) {
  try {
    let { lat, lon, city } = req.query;

    if (city && (!lat || !lon)) {
      const geo = await geocodeCity(city);
      lat = geo?.lat || 28.6139;
      lon = geo?.lon || 77.2090;
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
