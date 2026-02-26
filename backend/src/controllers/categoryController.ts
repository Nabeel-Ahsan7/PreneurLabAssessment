import { Request, Response } from 'express';
import Category from '../models/Category';

/** Helper to create a URL-safe slug */
const slugify = (text: string): string =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');

/** POST /categories — Admin only */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: 'Category name is required.' });
            return;
        }

        const slug = slugify(name);
        const existing = await Category.findOne({ slug });
        if (existing) {
            res.status(409).json({ message: 'Category already exists.' });
            return;
        }

        const category = await Category.create({ name, slug });
        res.status(201).json(category);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** GET /categories */
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** GET /categories/:slug */
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            res.status(404).json({ message: 'Category not found.' });
            return;
        }
        res.json(category);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** PUT /categories/:id — Admin only */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: 'Category name is required.' });
            return;
        }

        const slug = slugify(name);
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, slug },
            { new: true, runValidators: true }
        );

        if (!category) {
            res.status(404).json({ message: 'Category not found.' });
            return;
        }
        res.json(category);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** DELETE /categories/:id — Admin only */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found.' });
            return;
        }
        res.json({ message: 'Category deleted.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
