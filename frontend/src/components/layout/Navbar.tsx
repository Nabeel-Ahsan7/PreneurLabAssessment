'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { colors, shadows, radii } from '@/lib/tokens';
import type { Category } from '@/types';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [showCategories, setShowCategories] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        api<Category[]>('/categories', { skipAuth: true }).then(setCategories).catch(() => { });
    }, []);

    const handleSearch = (value: string) => {
        setSearch(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            if (value.trim()) {
                router.push(`/products?search=${encodeURIComponent(value.trim())}`);
            }
        }, 500);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/products?search=${encodeURIComponent(search.trim())}`);
        }
    };

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
                    PreneurShop
                </Link>

                {/* Categories dropdown */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                        onClick={() => setShowCategories(!showCategories)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: 14,
                            fontWeight: 500,
                            color: colors.neutral[700],
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: radii.button,
                            fontFamily: 'inherit',
                        }}
                    >
                        Categories ▾
                    </button>
                    {showCategories && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                background: '#fff',
                                border: `1px solid ${colors.neutral[200]}`,
                                borderRadius: radii.card,
                                boxShadow: shadows.hover,
                                minWidth: 180,
                                padding: 8,
                                zIndex: 10,
                            }}
                        >
                            {categories.map((cat) => (
                                <Link
                                    key={cat._id}
                                    href={`/products?category=${cat._id}`}
                                    onClick={() => setShowCategories(false)}
                                    style={{
                                        display: 'block',
                                        padding: '8px 12px',
                                        color: colors.neutral[700],
                                        textDecoration: 'none',
                                        fontSize: 14,
                                        borderRadius: 6,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = colors.neutral[100]; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                            {categories.length === 0 && (
                                <p style={{ padding: '8px 12px', color: colors.neutral[400], fontSize: 13, margin: 0 }}>No categories</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: 480 }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        aria-label="Search products"
                        style={{
                            width: '100%',
                            padding: '9px 16px',
                            borderRadius: radii.input,
                            border: `1px solid ${colors.neutral[300]}`,
                            fontSize: 14,
                            outline: 'none',
                            fontFamily: 'inherit',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = colors.primary[500]; }}
                        onBlur={(e) => { e.target.style.borderColor = colors.neutral[300]; }}
                    />
                </form>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    {/* Cart icon */}
                    {user && (
                        <Link
                            href="/cart"
                            style={{
                                textDecoration: 'none',
                                fontSize: 22,
                                color: colors.neutral[700],
                                padding: 4,
                            }}
                            aria-label="Cart"
                        >
                            🛒
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
