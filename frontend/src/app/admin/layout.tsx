'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { PageLoading } from '@/components/ui/Loading';
import { colors, radii, shadows } from '@/lib/tokens';
import './admin.css';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Products', href: '/admin/products', icon: '📦' },
    { label: 'Categories', href: '/admin/categories', icon: '🏷️' },
    { label: 'Reports', href: '/admin/reports', icon: '📈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push('/');
        }
    }, [user, loading, isAdmin]);

    if (loading) return <PageLoading />;
    if (!isAdmin) return null;

    return (
        <div className="admin-layout" style={{ display: 'flex', gap: 24, minHeight: '70vh' }}>
            {/* Sidebar */}
            <aside
                className="admin-sidebar"
                style={{
                    width: 220,
                    background: colors.neutral[50],
                    borderRadius: radii.card,
                    border: `1px solid ${colors.neutral[200]}`,
                    padding: 16,
                    flexShrink: 0,
                    height: 'fit-content',
                    position: 'sticky',
                    top: 88,
                }}
            >
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: colors.neutral[400], marginBottom: 12, letterSpacing: 1 }}>
                    Admin Panel
                </p>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '10px 12px',
                                    borderRadius: 8,
                                    textDecoration: 'none',
                                    fontSize: 14,
                                    fontWeight: active ? 600 : 400,
                                    color: active ? colors.primary[600] : colors.neutral[600],
                                    background: active ? colors.primary[50] : 'transparent',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = colors.neutral[100]; }}
                                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* CoclassName="admin-content" ntent */}
            <main style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
