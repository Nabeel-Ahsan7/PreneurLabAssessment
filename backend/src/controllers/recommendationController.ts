import { Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import User from '../models/User';
import Order from '../models/Order';
import SearchHistory from '../models/SearchHistory';
import { AuthRequest } from '../types';

/**
 * GET /recommendations — Rule-based recommendation engine
 * 
 * Priority:
 * 1. Products from categories user has purchased
 * 2. Products matching user's most frequent searches
 * 3. Products matching user's recent searches
 * 4. Top-selling products (fallback)
 */
export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const limit = 12;
        const recommendedIds = new Set<string>();
        const recommendations: any[] = [];

        // Helper: add products if not already recommended
        const addProducts = (products: any[], reason: string) => {
            for (const product of products) {
                const id = product._id.toString();
                if (!recommendedIds.has(id) && recommendations.length < limit) {
                    recommendedIds.add(id);
                    recommendations.push({ ...product.toObject?.() || product, reason });
                }
            }
        };

        // 1. Products from categories user purchased from
        const user = await User.findById(userId);
        if (user && user.purchasedProducts.length > 0) {
            const purchasedProducts = await Product.find({
                _id: { $in: user.purchasedProducts },
            }).select('categories');

            const purchasedCategoryIds = [
                ...new Set(
                    purchasedProducts.flatMap((p) => p.categories.map((c) => c.toString()))
                ),
            ];

            if (purchasedCategoryIds.length > 0) {
                const categoryProducts = await Product.find({
                    categories: { $in: purchasedCategoryIds },
                    _id: { $nin: user.purchasedProducts },
                    stock: { $gt: 0 },
                })
                    .populate('categories', 'name slug')
                    .limit(limit);

                addProducts(categoryProducts, 'Based on your purchase history');
            }
        }

        // 2. Products matching frequent searches
        if (recommendations.length < limit) {
            const frequentSearches = await SearchHistory.find({ user: userId })
                .sort({ count: -1 })
                .limit(5);

            for (const search of frequentSearches) {
                if (recommendations.length >= limit) break;
                const searchProducts = await Product.find({
                    $or: [
                        { name: { $regex: search.keyword, $options: 'i' } },
                        { description: { $regex: search.keyword, $options: 'i' } },
                    ],
                    stock: { $gt: 0 },
                })
                    .populate('categories', 'name slug')
                    .limit(4);

                addProducts(searchProducts, `Matches your search: "${search.keyword}"`);
            }
        }

        // 3. Products matching recent searches
        if (recommendations.length < limit) {
            const recentSearches = await SearchHistory.find({ user: userId })
                .sort({ lastSearchedAt: -1 })
                .limit(5);

            for (const search of recentSearches) {
                if (recommendations.length >= limit) break;
                const searchProducts = await Product.find({
                    $or: [
                        { name: { $regex: search.keyword, $options: 'i' } },
                        { description: { $regex: search.keyword, $options: 'i' } },
                    ],
                    stock: { $gt: 0 },
                })
                    .populate('categories', 'name slug')
                    .limit(4);

                addProducts(searchProducts, `Recently searched: "${search.keyword}"`);
            }
        }

        // 4. Fallback: Top-selling products
        if (recommendations.length < limit) {
            const topSelling = await Order.aggregate([
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.product',
                        totalSold: { $sum: '$items.quantity' },
                    },
                },
                { $sort: { totalSold: -1 } },
                { $limit: limit },
            ]);

            const topProductIds = topSelling
                .map((item) => item._id)
                .filter((id) => !recommendedIds.has(id.toString()));

            if (topProductIds.length > 0) {
                const topProducts = await Product.find({
                    _id: { $in: topProductIds },
                    stock: { $gt: 0 },
                }).populate('categories', 'name slug');

                addProducts(topProducts, 'Popular product');
            }
        }

        // Final fallback: newest products
        if (recommendations.length < limit) {
            const newestProducts = await Product.find({
                stock: { $gt: 0 },
            })
                .populate('categories', 'name slug')
                .sort({ createdAt: -1 })
                .limit(limit);

            addProducts(newestProducts, 'New arrival');
        }

        res.json(recommendations);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
