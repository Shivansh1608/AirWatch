import { Router } from 'express';
import { compareCities } from '../controllers/compareController.js';

const router = Router();

router.get('/', compareCities);

export default router;
