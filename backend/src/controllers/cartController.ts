import { Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../types';

/** POST /cart — Add item to cart */
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user!.userId;

        if (!productId) {
            res.status(400).json({ message: 'Product ID is required.' });
            return;
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found.' });
            return;
        }

        if (product.stock < quantity) {
            res.status(400).json({ message: `Insufficient stock. Available: ${product.stock}` });
            return;
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: Number(quantity) }],
            });
        } else {
            // Check if product exists in cart
            const existingItem = cart.items.find(
                (item) => item.product.toString() === productId
            );

            if (existingItem) {
                const newQty = existingItem.quantity + Number(quantity);
                if (newQty > product.stock) {
                    res.status(400).json({
                        message: `Cannot add more. Stock: ${product.stock}, In cart: ${existingItem.quantity}`,
                    });
                    return;
                }
                existingItem.quantity = newQty;
            } else {
                cart.items.push({ product: productId, quantity: Number(quantity) });
            }

            await cart.save();
        }

        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** GET /cart — Get user's cart */
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const cart = await Cart.findOne({ user: req.user!.userId }).populate('items.product');
        if (!cart) {
            res.json({ user: req.user!.userId, items: [] });
            return;
        }
        res.json(cart);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** DELETE /cart/:productId — Remove item from cart */
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user!.userId });

        if (!cart) {
            res.status(404).json({ message: 'Cart not found.' });
            return;
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
