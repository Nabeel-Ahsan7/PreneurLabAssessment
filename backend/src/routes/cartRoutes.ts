import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.delete('/:productId', authMiddleware, removeFromCart);

export default router;
