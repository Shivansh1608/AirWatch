import { Router } from 'express';
import { askAIAssistant, getCityInsights } from '../controllers/aiController.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply AI rate limiter to prevent abuse
router.use(aiLimiter);

router.post('/assistant', askAIAssistant);
router.get('/insights', getCityInsights);

export default router;
