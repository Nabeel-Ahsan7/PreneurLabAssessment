import { Router } from 'express';
import { placeOrder, getOrders } from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, placeOrder);
router.get('/', authMiddleware, getOrders);

export default router;
