import { Router } from 'express';
import { register, login, refresh, logout, getMe, updatePreferences } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/me', verifyToken, getMe);
router.patch('/preferences', verifyToken, updatePreferences);

export default router;
