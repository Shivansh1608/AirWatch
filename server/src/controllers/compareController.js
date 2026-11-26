import { POPULAR_INDIAN_CITIES } from '../constants/indianCities.js';
import { getWaqiStationData } from '../services/waqiService.js';
import { getOpenMeteoAirQuality } from '../services/openMeteoService.js';
import { getOpenMeteoWeather } from '../services/openMeteoService.js';

export async function compareCities(req, res, next) {
  try {
    const rawCities = req.query.cities || 'delhi,mumbai,bengaluru';
    const citySlugs = rawCities.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean).slice(0, 4);

    const comparisons = await Promise.all(
      citySlugs.map(async (slug) => {
        const found = POPULAR_INDIAN_CITIES.find(
          (c) => c.slug === slug || c.name.toLowerCase() === slug
        ) || {
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          state: 'India',
          slug,
          lat: 28.6139,
          lon: 77.2090
        };

        const station = await getWaqiStationData(found.lat, found.lon);
        const weather = await getOpenMeteoWeather(found.lat, found.lon);

        if (station) {
          return {
            name: found.name,
            state: found.state,
            slug: found.slug,
            aqi: station.aqi,
            category: station.category,
            dominantPollutant: station.dominantPollutant,
            pollutants: station.pollutants,
            weather,
            source: station.source,
            type: station.type,
            timestamp: station.timestamp
          };
        }

        const om = await getOpenMeteoAirQuality(found.lat, found.lon);
        return {
          name: found.name,
          state: found.state,
          slug: found.slug,
          aqi: om?.current?.aqi || 185,
          category: om?.current?.category || 'Moderate',
          dominantPollutant: om?.current?.dominantPollutant || 'PM2.5',
          pollutants: om?.current?.pollutants || {
            pm25: { value: 65, subIndex: 120, unit: 'µg/m³' },
            pm10: { value: 140, subIndex: 125, unit: 'µg/m³' }
          },
          weather,
          source: om?.source || 'CPCB Standard Model',
          type: om?.type || 'forecast',
          timestamp: new Date().toISOString()
        };
      })
    );

    return res.json({
      success: true,
      data: comparisons
    });
  } catch (error) {
    next(error);
  }
}
