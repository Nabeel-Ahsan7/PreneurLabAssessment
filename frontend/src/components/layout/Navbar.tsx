'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import { colors, shadows, radii } from '@/lib/tokens';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const [showProfile, setShowProfile] = useState(false);

    return (
        <nav
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: '#fff',
                borderBottom: `1px solid ${colors.neutral[200]}`,
                boxShadow: shadows.soft,
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '0 24px',
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 20, color: colors.primary[500], flexShrink: 0 }}>
                    NabeelShop
                </Link>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    {/* Cart icon */}
                    {user && (
                        <Link
                            href="/cart"
                            style={{
                                position: 'relative',
                                textDecoration: 'none',
                                fontSize: 22,
                                color: colors.neutral[700],
                                padding: 4,
                            }}
                            aria-label="Cart"
                        >
                            🛒
                            {cartCount > 0 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -4,
                                        background: colors.error,
                                        color: '#fff',
                                        borderRadius: '50%',
                                        minWidth: 18,
                                        height: 18,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        padding: '0 4px',
                                        border: '2px solid #fff',
                                    }}
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Profile / Login */}
                    {user ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                style={{
                                    background: colors.primary[500],
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 36,
                                    height: 36,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </button>
                            {showProfile && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: 8,
                                        background: '#fff',
                                        border: `1px solid ${colors.neutral[200]}`,
                                        borderRadius: radii.card,
                                        boxShadow: shadows.hover,
                                        minWidth: 180,
                                        padding: 8,
                                        zIndex: 10,
                                    }}
                                >
                                    <p style={{ padding: '8px 12px', margin: 0, fontSize: 13, color: colors.neutral[500] }}>
                                        {user.email}
                                    </p>
                                    <Link
                                        href="/orders"
                                        onClick={() => setShowProfile(false)}
                                        style={{ display: 'block', padding: '8px 12px', color: colors.neutral[700], textDecoration: 'none', fontSize: 14, borderRadius: 6 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = colors.neutral[100]; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        My Orders
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setShowProfile(false)}
                                            style={{ display: 'block', padding: '8px 12px', color: colors.primary[600], textDecoration: 'none', fontSize: 14, fontWeight: 500, borderRadius: 6 }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = colors.neutral[100]; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { logout(); setShowProfile(false); }}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '8px 12px',
                                            color: colors.error,
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: 14,
                                            borderRadius: 6,
                                            fontFamily: 'inherit',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = colors.neutral[100]; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            style={{
                                textDecoration: 'none',
                                padding: '8px 20px',
                                background: colors.primary[500],
                                color: '#fff',
                                borderRadius: radii.button,
                                fontSize: 14,
                                fontWeight: 600,
                            }}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
