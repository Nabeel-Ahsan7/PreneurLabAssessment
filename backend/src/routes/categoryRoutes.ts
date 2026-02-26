import { Router } from 'express';
import {
    createCategory,
    getCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, createCategory);
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;
