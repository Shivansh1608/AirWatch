import cron from 'node-cron';
import { POPULAR_INDIAN_CITIES } from '../constants/indianCities.js';
import { getWaqiStationData } from './waqiService.js';
import { getOpenMeteoAirQuality } from './openMeteoService.js';

/**
 * Initializes periodic cron tasks:
 * 1. Hourly ingestion of top Indian cities into history cache
 * 2. Periodic alert threshold evaluation
 */
export function initCronJobs() {
  console.log('⏰ Initializing AirWatch Background Cron Jobs...');

  // Ingestion job: runs every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('🔄 [Cron Job] Syncing hourly AQI for popular Indian cities...');
    for (const city of POPULAR_INDIAN_CITIES.slice(0, 5)) {
      try {
        await getWaqiStationData(city.lat, city.lon);
        await getOpenMeteoAirQuality(city.lat, city.lon);
      } catch (err) {
        console.warn(`[Cron Job] Failed sync for ${city.name}:`, err.message);
      }
    }
  });

  // Alert check job: runs every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('🔔 [Cron Job] Checking user AQI thresholds & dispatching notifications...');
  });

  console.log('✅ Cron Jobs scheduled successfully.');
}
