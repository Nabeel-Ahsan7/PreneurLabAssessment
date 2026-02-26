import { Request, Response } from 'express';
import Product from '../models/Product';
import SearchHistory from '../models/SearchHistory';
import { AuthRequest } from '../types';

/** POST /products — Admin only (multipart/form-data) */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, stock, description, categories } = req.body;

        if (!name || price === undefined || stock === undefined || !description) {
            res.status(400).json({ message: 'Name, price, stock, and description are required.' });
            return;
        }

        const images = (req.files as Express.Multer.File[])?.map(
            (file) => `/uploads/${file.filename}`
        ) || [];

        const parsedCategories = categories
            ? (typeof categories === 'string' ? JSON.parse(categories) : categories)
            : [];

        const product = await Product.create({
            name,
            price: Number(price),
            stock: Number(stock),
            description,
            images,
            categories: parsedCategories,
        });

        res.status(201).json(product);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** GET /products — Public (pagination + search + category filter) */
export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
        const skip = (page - 1) * limit;
        const search = (req.query.search as string) || '';
        const category = (req.query.category as string) || '';

        // Build filter query
        const filter: any = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];

            // Save search history for logged-in users
            if (req.user) {
                const keyword = search.toLowerCase().trim();
                await SearchHistory.findOneAndUpdate(
                    { user: req.user.userId, keyword },
                    { $inc: { count: 1 }, $set: { lastSearchedAt: new Date() } },
                    { upsert: true }
                );
            }
        }

        if (category) {
            const categoryIds = category.split(',');
            filter.categories = { $in: categoryIds };
        }

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('categories', 'name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(filter),
        ]);

        res.json({
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** GET /products/:id — Public */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id).populate('categories', 'name slug');
        if (!product) {
            res.status(404).json({ message: 'Product not found.' });
            return;
        }
        res.json(product);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** PUT /products/:id — Admin only */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, stock, description, categories } = req.body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = Number(price);
        if (stock !== undefined) updateData.stock = Number(stock);
        if (description !== undefined) updateData.description = description;
        if (categories !== undefined) {
            updateData.categories = typeof categories === 'string' ? JSON.parse(categories) : categories;
        }

        // If new images uploaded, add them
        if (req.files && (req.files as Express.Multer.File[]).length > 0) {
            const newImages = (req.files as Express.Multer.File[]).map(
                (file) => `/uploads/${file.filename}`
            );
            updateData.images = newImages;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).populate('categories', 'name slug');

        if (!product) {
            res.status(404).json({ message: 'Product not found.' });
            return;
        }

        res.json(product);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** DELETE /products/:id — Admin only */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found.' });
            return;
        }
        res.json({ message: 'Product deleted.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
