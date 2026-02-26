import { Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../types';

/** GET /reports/summary — Admin only */
export const getReportSummary = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Aggregate total orders and revenue
        const summaryAgg = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                },
            },
        ]);

        const summary = summaryAgg[0] || { totalOrders: 0, totalRevenue: 0 };

        // Aggregate top 3 best-selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    name: '$product.name',
                    totalSold: 1,
                    totalRevenue: 1,
                },
            },
        ]);

        res.json({
            totalOrders: summary.totalOrders,
            totalRevenue: summary.totalRevenue,
            topProducts,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
