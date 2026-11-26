import { Router } from 'express';
import { getAlerts, createAlert, toggleAlert, deleteAlert } from '../controllers/alertController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getAlerts);
router.post('/', verifyToken, createAlert);
router.patch('/:id', verifyToken, toggleAlert);
router.delete('/:id', verifyToken, deleteAlert);

export default router;
