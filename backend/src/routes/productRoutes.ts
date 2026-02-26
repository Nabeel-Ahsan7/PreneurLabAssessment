import { Router } from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// Public routes (optionally pass auth for search history tracking)
router.get('/', (req, res, next) => {
    // Try to attach user if token present, but don't require it
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authMiddleware(req as any, res, next);
    }
    next();
}, getProducts);

router.get('/:id', getProductById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 5), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 5), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
