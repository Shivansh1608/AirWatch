import { Router } from 'express';
import { getFavourites, addFavourite, removeFavourite } from '../controllers/favouriteController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getFavourites);
router.post('/', verifyToken, addFavourite);
router.delete('/:slug', verifyToken, removeFavourite);

export default router;
