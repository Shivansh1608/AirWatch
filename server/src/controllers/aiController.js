import { generateHealthAdvice, generatePollutionInsights } from '../services/aiService.js';
import { getWaqiStationData } from '../services/waqiService.js';
import { getOpenMeteoAirQuality, getOpenMeteoWeather } from '../services/openMeteoService.js';
import { POPULAR_INDIAN_CITIES } from '../constants/indianCities.js';

export async function askAIAssistant(req, res, next) {
  try {
    const { city = 'Delhi', message = 'Can I exercise outside today?', sensitiveGroup = false } = req.body;

    const match = POPULAR_INDIAN_CITIES.find(
      (c) => c.slug === city.toLowerCase() || c.name.toLowerCase() === city.toLowerCase()
    ) || POPULAR_INDIAN_CITIES[0];

    const station = await getWaqiStationData(match.lat, match.lon);
    const weather = await getOpenMeteoWeather(match.lat, match.lon);

    let aqi = station?.aqi;
    let dominantPollutant = station?.dominantPollutant || 'PM2.5';
    let pollutants = station?.pollutants;

    if (!aqi) {
      const om = await getOpenMeteoAirQuality(match.lat, match.lon);
      aqi = om?.current?.aqi || 240;
      dominantPollutant = om?.current?.dominantPollutant || 'PM2.5';
      pollutants = om?.current?.pollutants;
    }

    const advice = await generateHealthAdvice({
      city: match.name,
      aqi,
      dominantPollutant,
      pollutants,
      weather,
      userMessage: message,
      sensitiveGroup
    });

    return res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    next(error);
  }
}

export async function getCityInsights(req, res, next) {
  try {
    const city = req.query.city || 'Delhi';
    const match = POPULAR_INDIAN_CITIES.find(
      (c) => c.slug === city.toLowerCase() || c.name.toLowerCase() === city.toLowerCase()
    ) || POPULAR_INDIAN_CITIES[0];

    const station = await getWaqiStationData(match.lat, match.lon);
    const weather = await getOpenMeteoWeather(match.lat, match.lon);

    let aqi = station?.aqi;
    let dominantPollutant = station?.dominantPollutant || 'PM2.5';

    if (!aqi) {
      const om = await getOpenMeteoAirQuality(match.lat, match.lon);
      aqi = om?.current?.aqi || 240;
      dominantPollutant = om?.current?.dominantPollutant || 'PM2.5';
    }

    const insights = await generatePollutionInsights({
      city: match.name,
      aqi,
      dominantPollutant,
      weather
    });

    return res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
}
