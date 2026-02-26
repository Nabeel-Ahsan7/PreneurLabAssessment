'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import { PageLoading, EmptyState } from '@/components/ui/Loading';
import { colors, radii, shadows } from '@/lib/tokens';
import type { Order } from '@/types';

export default function OrdersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        api<Order[]>('/orders')
            .then(setOrders)
            .catch(() => toast('Failed to load orders', 'error'))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <PageLoading />;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.neutral[900], marginBottom: 24 }}>
                My Orders
            </h1>

            {orders.length === 0 ? (
                <EmptyState message="No orders yet. Start shopping!" icon="📋" />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            style={{
                                padding: 20,
                                background: '#fff',
                                border: `1px solid ${colors.neutral[200]}`,
                                borderRadius: radii.card,
                                boxShadow: shadows.soft,
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div>
                                    <p style={{ fontSize: 12, color: colors.neutral[400], margin: 0 }}>
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p style={{ fontSize: 12, color: colors.neutral[400], margin: '2px 0 0' }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <p style={{ fontSize: 18, fontWeight: 700, color: colors.neutral[900], margin: 0 }}>
                                    ${order.totalAmount.toFixed(2)}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {order.items.map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 14,
                                            color: colors.neutral[600],
                                            padding: '6px 0',
                                            borderTop: i > 0 ? `1px solid ${colors.neutral[100]}` : 'none',
                                        }}
                                    >
                                        <span>
                                            {typeof item.product === 'object' ? item.product.name : 'Product'} × {item.quantity}
                                        </span>
                                        <span style={{ fontWeight: 600 }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
