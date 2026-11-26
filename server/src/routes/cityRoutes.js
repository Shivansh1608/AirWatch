import { Router } from 'express';
import { searchCities, getPopularCities } from '../controllers/cityController.js';

const router = Router();

router.get('/search', searchCities);
router.get('/popular', getPopularCities);

export default router;
