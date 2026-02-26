'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { colors, radii, shadows } from '@/lib/tokens';
import { API_BASE } from '@/lib/api';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (productId: string) => void;
    addingToCart?: boolean;
}

export default function ProductCard({ product, onAddToCart, addingToCart }: ProductCardProps) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    const imgSrc = product.images?.[0]
        ? `${API_BASE}${product.images[0]}`
        : null;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: radii.card,
                boxShadow: hovered ? shadows.hover : shadows.soft,
                transform: hovered ? 'translateY(-2px)' : 'none',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Image */}
            <Link href={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: colors.neutral[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    {imgSrc && !imgError ? (
                        <img
                            src={imgSrc}
                            alt={product.name}
                            loading="lazy"
                            onError={() => setImgError(true)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ fontSize: 48, color: colors.neutral[300] }}>📷</span>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <Link
                    href={`/products/${product._id}`}
                    style={{
                        textDecoration: 'none',
                        color: colors.neutral[900],
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {product.name}
                </Link>

                {/* Category badges */}
                {product.categories?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {product.categories.map((cat) => (
                            <span
                                key={cat._id}
                                style={{
                                    fontSize: 11,
                                    padding: '2px 8px',
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

                {/* Price + stock */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: colors.neutral[900] }}>
                        ${product.price.toFixed(2)}
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                        <span style={{ fontSize: 11, color: colors.warning, fontWeight: 600 }}>
                            Only {product.stock} left
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span style={{ fontSize: 11, color: colors.error, fontWeight: 600 }}>
                            Out of stock
                        </span>
                    )}
                </div>

                {/* Add to cart */}
                {product.stock > 0 && onAddToCart && (
                    <Button
                        size="sm"
                        loading={addingToCart}
                        onClick={() => onAddToCart(product._id)}
                        style={{ width: '100%', marginTop: 4 }}
                    >
                        Add to Cart
                    </Button>
                )}
            </div>
        </div>
    );
}
