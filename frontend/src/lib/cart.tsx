'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './auth';
import { api } from './api';

interface CartContextType {
    cartCount: number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    const refreshCart = useCallback(async () => {
        if (!user) {
            setCartCount(0);
            return;
        }

        try {
            const data = await api<{ items: any[] }>('/cart');
            const count = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            console.log('Refreshing cart, new count:', count);
            setCartCount(count);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            setCartCount(0);
        }
    }, [user]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
