import { generateHealthAdvice, generatePollutionInsights } from '../services/aiService.js';
import { getWaqiStationData } from '../services/waqiService.js';
import { getOpenMeteoAirQuality, getOpenMeteoWeather, geocodeCity } from '../services/openMeteoService.js';
import { POPULAR_INDIAN_CITIES } from '../constants/indianCities.js';

export async function askAIAssistant(req, res, next) {
  try {
    const { city = 'Delhi', message = 'Can I exercise outside today?', sensitiveGroup = false } = req.body;

    let target = POPULAR_INDIAN_CITIES.find(
      (c) => c.slug === city.toLowerCase() || c.name.toLowerCase() === city.toLowerCase()
    );

    if (!target) {
      target = await geocodeCity(city) || { name: city, lat: 28.6139, lon: 77.2090 };
    }

    const station = await getWaqiStationData(target.lat, target.lon);
    const weather = await getOpenMeteoWeather(target.lat, target.lon);

    let aqi = station?.aqi;
    let dominantPollutant = station?.dominantPollutant || 'PM2.5';
    let pollutants = station?.pollutants;

    if (!aqi) {
      const om = await getOpenMeteoAirQuality(target.lat, target.lon);
      aqi = om?.current?.aqi || 240;
      dominantPollutant = om?.current?.dominantPollutant || 'PM2.5';
      pollutants = om?.current?.pollutants;
    }

    const advice = await generateHealthAdvice({
      city: target.name,
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
    let target = POPULAR_INDIAN_CITIES.find(
      (c) => c.slug === city.toLowerCase() || c.name.toLowerCase() === city.toLowerCase()
    );

    if (!target) {
      target = await geocodeCity(city) || { name: city, lat: 28.6139, lon: 77.2090 };
    }

    const station = await getWaqiStationData(target.lat, target.lon);
    const weather = await getOpenMeteoWeather(target.lat, target.lon);

    let aqi = station?.aqi;
    let dominantPollutant = station?.dominantPollutant || 'PM2.5';

    if (!aqi) {
      const om = await getOpenMeteoAirQuality(target.lat, target.lon);
      aqi = om?.current?.aqi || 240;
      dominantPollutant = om?.current?.dominantPollutant || 'PM2.5';
    }

    const insights = await generatePollutionInsights({
      city: target.name,
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
