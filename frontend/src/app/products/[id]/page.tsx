'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, API_BASE } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import { PageLoading } from '@/components/ui/Loading';
import { colors, radii, shadows } from '@/lib/tokens';
import type { Product } from '@/types';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImg, setSelectedImg] = useState(0);

    useEffect(() => {
        api<Product>(`/products/${id}`, { skipAuth: true })
            .then(setProduct)
            .catch(() => toast('Product not found', 'error'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) { router.push('/login'); return; }
        setAddingToCart(true);
        try {
            await api('/cart', { method: 'POST', body: JSON.stringify({ productId: id, quantity }) });
            toast('Added to cart!', 'success');
        } catch (err: any) {
            toast(err.message || 'Failed to add to cart', 'error');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <PageLoading />;
    if (!product) return <div style={{ textAlign: 'center', padding: 60, color: colors.neutral[400] }}>Product not found.</div>;

    const imgSrc = product.images?.[selectedImg]
        ? `${API_BASE}${product.images[selectedImg]}`
        : null;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, maxWidth: 960, margin: '0 auto' }}>
            {/* Image section */}
            <div>
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: colors.neutral[100],
                        borderRadius: radii.card,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${colors.neutral[200]}`,
                    }}
                >
                    {imgSrc ? (
                        <img src={imgSrc} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: 80, color: colors.neutral[300] }}>📷</span>
                    )}
                </div>
                {product.images.length > 1 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        {product.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImg(i)}
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 8,
                                    border: selectedImg === i ? `2px solid ${colors.primary[500]}` : `1px solid ${colors.neutral[200]}`,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    padding: 0,
                                    background: colors.neutral[100],
                                }}
                            >
                                <img src={`${API_BASE}${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.neutral[900], margin: 0 }}>
                    {product.name}
                </h1>

                {product.categories?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {product.categories.map((cat) => (
                            <span
                                key={cat._id}
                                style={{
                                    fontSize: 12,
                                    padding: '3px 10px',
                                    background: colors.primary[50],
                                    color: colors.primary[700],
                                    borderRadius: 20,
                                    fontWeight: 500,
                                }}
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                )}

                <p style={{ fontSize: 32, fontWeight: 800, color: colors.neutral[900], margin: 0 }}>
                    ${product.price.toFixed(2)}
                </p>

                {/* Stock status */}
                {product.stock > 0 ? (
                    <p style={{ fontSize: 14, color: product.stock <= 5 ? colors.warning : colors.success, fontWeight: 600, margin: 0 }}>
                        {product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In Stock'}
                    </p>
                ) : (
                    <p style={{ fontSize: 14, color: colors.error, fontWeight: 600, margin: 0 }}>
                        Out of Stock
                    </p>
                )}

                <p style={{ fontSize: 15, color: colors.neutral[600], lineHeight: 1.7, margin: 0 }}>
                    {product.description}
                </p>

                {/* Add to cart */}
                {product.stock > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: `1px solid ${colors.neutral[300]}`,
                                borderRadius: radii.input,
                                overflow: 'hidden',
                            }}
                        >
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                style={{
                                    padding: '8px 14px',
                                    border: 'none',
                                    background: colors.neutral[100],
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    fontFamily: 'inherit',
                                }}
                            >
                                −
                            </button>
                            <span style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                style={{
                                    padding: '8px 14px',
                                    border: 'none',
                                    background: colors.neutral[100],
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    fontFamily: 'inherit',
                                }}
                            >
                                +
                            </button>
                        </div>
                        <Button loading={addingToCart} onClick={handleAddToCart} size="lg">
                            Add to Cart
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
