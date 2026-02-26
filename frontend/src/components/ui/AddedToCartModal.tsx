'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { colors, radii, shadows } from '@/lib/tokens';
import Button from './Button';

interface AddedToCartModalProps {
    open: boolean;
    onClose: () => void;
    productName?: string;
}

export default function AddedToCartModal({ open, onClose, productName }: AddedToCartModalProps) {
    const router = useRouter();

    if (!open) return null;

    const handleViewCart = () => {
        onClose();
        router.push('/cart');
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)',
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderRadius: radii.card,
                    boxShadow: shadows.hover,
                    padding: 32,
                    maxWidth: 420,
                    width: '90%',
                    textAlign: 'center',
                }}
            >
                <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: colors.success,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.neutral[900], margin: '0 0 8px' }}>
                    Added to Cart!
                </h2>
                {productName && (
                    <p style={{ fontSize: 14, color: colors.neutral[600], margin: '0 0 24px' }}>
                        {productName} has been added to your cart
                    </p>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
                        Continue Shopping
                    </Button>
                    <Button onClick={handleViewCart} style={{ flex: 1 }}>
                        View Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}
