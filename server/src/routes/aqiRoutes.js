import { Router } from 'express';
import { getCurrentAQI, getForecast, getHistory, getNearbyStations } from '../controllers/aqiController.js';

const router = Router();

router.get('/current', getCurrentAQI);
router.get('/forecast', getForecast);
router.get('/history', getHistory);
router.get('/stations', getNearbyStations);

export default router;
