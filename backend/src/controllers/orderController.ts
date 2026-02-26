import { Response } from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { AuthRequest } from '../types';

/** POST /orders — Place order from cart */
export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;

        // 1. Fetch user cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            res.status(400).json({ message: 'Cart is empty.' });
            return;
        }

        const orderItems: Array<{ product: mongoose.Types.ObjectId; quantity: number; price: number }> = [];
        let totalAmount = 0;
        const purchasedProductIds: mongoose.Types.ObjectId[] = [];

        // 2. Validate stock for all items
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                res.status(400).json({ message: `Product not found: ${item.product}` });
                return;
            }

            if (product.stock < item.quantity) {
                res.status(400).json({
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
                });
                return;
            }

            orderItems.push({
                product: product._id as mongoose.Types.ObjectId,
                quantity: item.quantity,
                price: product.price,
            });
            totalAmount += product.price * item.quantity;
            purchasedProductIds.push(product._id as mongoose.Types.ObjectId);
        }

        // 3. Deduct stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        // 4. Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
        });

        // 5. Save purchased products to user
        await User.findByIdAndUpdate(userId, {
            $addToSet: { purchasedProducts: { $each: purchasedProductIds } },
        });

        // 6. Clear cart
        await Cart.findByIdAndDelete(cart._id);

        const populatedOrder = await Order.findById(order._id).populate('items.product');
        res.status(201).json(populatedOrder);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** GET /orders — Get user's orders */
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ user: req.user!.userId })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
