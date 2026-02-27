'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, API_BASE } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import { PageLoading, EmptyState } from '@/components/ui/Loading';
import { colors, radii, shadows } from '@/lib/tokens';
import type { Cart } from '@/types';

export default function CartPage() {
    const { user } = useAuth();
    const { refreshCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const data = await api<Cart>('/cart');
            setCart(data);
        } catch {
            toast('Failed to load cart', 'error');
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId: string) => {
        setRemovingId(productId);
        try {
            const data = await api<Cart>(`/cart/${productId}`, { method: 'DELETE' });
            setCart(data);
            await refreshCart(); // Update cart count immediately
            toast('Item removed', 'info');
        } catch (err: any) {
            toast(err.message || 'Failed to remove item', 'error');
        } finally {
            setRemovingId(null);
        }
    };

    const placeOrder = async () => {
        setPlacingOrder(true);
        try {
            await api('/orders', { method: 'POST' });
            await refreshCart(); // Clear cart count after order
            toast('Order placed successfully!', 'success');
            router.push('/orders');
        } catch (err: any) {
            toast(err.message || 'Failed to place order', 'error');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return <PageLoading />;

    const items = cart?.items || [];
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.neutral[900], marginBottom: 24 }}>
                Your Cart
            </h1>

            {items.length === 0 ? (
                <EmptyState message="Your cart is empty. Start shopping!" icon="🛒" />
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {items.map((item) => {
                            const imgSrc = item.product.images?.[0] ? `${API_BASE}${item.product.images[0]}` : null;
                            return (
                                <div
                                    key={item.product._id}
                                    style={{
                                        display: 'flex',
                                        gap: 16,
                                        padding: 16,
                                        background: '#fff',
                                        border: `1px solid ${colors.neutral[200]}`,
                                        borderRadius: radii.card,
                                        boxShadow: shadows.soft,
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Image */}
                                    <div
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 8,
                                            background: colors.neutral[100],
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {imgSrc ? (
                                            <img src={imgSrc} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: 28, color: colors.neutral[300] }}>📷</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: 15, color: colors.neutral[900], margin: 0 }}>
                                            {item.product.name}
                                        </p>
                                        <p style={{ fontSize: 13, color: colors.neutral[500], margin: '4px 0 0' }}>
                                            ৳{item.product.price.toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>

                                    {/* Subtotal */}
                                    <p style={{ fontWeight: 700, fontSize: 16, color: colors.neutral[900], margin: 0, minWidth: 80, textAlign: 'right' }}>
                                        ৳{(item.product.price * item.quantity).toFixed(2)}
                                    </p>

                                    {/* Remove */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        loading={removingId === item.product._id}
                                        onClick={() => removeItem(item.product._id)}
                                        style={{ color: colors.error }}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div
                        style={{
                            marginTop: 24,
                            padding: 24,
                            background: colors.neutral[50],
                            borderRadius: radii.card,
                            border: `1px solid ${colors.neutral[200]}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <p style={{ fontSize: 14, color: colors.neutral[500], margin: 0 }}>
                                {items.length} item{items.length !== 1 ? 's' : ''}
                            </p>
                            <p style={{ fontSize: 24, fontWeight: 800, color: colors.neutral[900], margin: '4px 0 0' }}>
                                ৳{total.toFixed(2)}
                            </p>
                        </div>
                        <Button size="lg" loading={placingOrder} onClick={placeOrder}>
                            Place Order
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
