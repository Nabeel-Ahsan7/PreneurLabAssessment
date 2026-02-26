import { Router } from 'express';
import { getRecommendations } from '../controllers/recommendationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getRecommendations);

export default router;
