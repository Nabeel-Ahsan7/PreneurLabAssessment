import { Router } from 'express';
import { getReportSummary } from '../controllers/reportController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/summary', authMiddleware, adminMiddleware, getReportSummary);

export default router;
