'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import { useToast } from '@/components/ui/Toast';
import ProductCard from '@/components/products/ProductCard';
import { PageLoading, EmptyState } from '@/components/ui/Loading';
import AddedToCartModal from '@/components/ui/AddedToCartModal';
import Button from '@/components/ui/Button';
import { colors, radii } from '@/lib/tokens';
import type { Product, Category, PaginationInfo } from '@/types';

export default function ProductsPage() {
    return (
        <Suspense fallback={<PageLoading />}>
            <ProductsContent />
        </Suspense>
    );
}

function ProductsContent() {
    const { user } = useAuth();
    const { refreshCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [showAddedModal, setShowAddedModal] = useState(false);
    const [addedProductName, setAddedProductName] = useState('');
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<string | null>(null);

    const search = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', '12');
            if (search) params.set('search', search);
            if (categoryFilter) params.set('category', categoryFilter);

            const res = await api<{ products: Product[]; pagination: PaginationInfo }>(
                `/products?${params.toString()}`,
                { skipAuth: !user }
            );
            setProducts(res.products);
            setPagination(res.pagination);
        } catch {
            toast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, search, categoryFilter, user]);

    useEffect(() => {
        api<Category[]>('/categories', { skipAuth: true }).then(setCategories).catch(() => { });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        if (key !== 'page') params.set('page', '1');
        router.push(`/products?${params.toString()}`);
    };

    const handleAddToCart = async (productId: string) => {
        if (!user) { router.push('/login'); return; }
        setAddingId(productId);
        try {
            await api('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity: 1 }) });
            await refreshCart(); // Update cart count immediately
            const product = products.find(p => p._id === productId);
            setAddedProductName(product?.name || '');
            setShowAddedModal(true);
        } catch (err: any) {
            toast(err.message || 'Failed to add to cart', 'error');
        } finally {
            setAddingId(null);
        }
    };

    return (
        <div>
            <AddedToCartModal
                open={showAddedModal}
                onClose={() => setShowAddedModal(false)}
                productName={addedProductName}
            />
            <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.neutral[900], marginBottom: 24 }}>
                Products
            </h1>

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, alignItems: 'center' }}>
                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search products..."
                    defaultValue={search}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') updateParams('search', (e.target as HTMLInputElement).value);
                    }}
                    aria-label="Search products"
                    style={{
                        padding: '9px 16px',
                        borderRadius: radii.input,
                        border: `1px solid ${colors.neutral[300]}`,
                        fontSize: 14,
                        minWidth: 220,
                        fontFamily: 'inherit',
                        outline: 'none',
                    }}
                />

                {/* Category filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => updateParams('category', e.target.value)}
                    aria-label="Filter by category"
                    style={{
                        padding: '9px 16px',
                        borderRadius: radii.input,
                        border: `1px solid ${colors.neutral[300]}`,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: '#fff',
                        color: colors.neutral[700],
                        outline: 'none',
                    }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>

                {(search || categoryFilter) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/products')}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Products grid */}
            {loading ? (
                <PageLoading />
            ) : products.length === 0 ? (
                <EmptyState message="No products found. Try a different search or filter." icon="🔍" />
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                        {products.map((p) => (
                            <ProductCard
                                key={p._id}
                                product={p}
                                onAddToCart={handleAddToCart}
                                addingToCart={addingId === p._id}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 32 }}>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => updateParams('page', String(page - 1))}
                            >
                                ← Previous
                            </Button>
                            <span style={{ fontSize: 14, color: colors.neutral[600] }}>
                                Page {page} of {pagination.pages}
                            </span>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={page >= pagination.pages}
                                onClick={() => updateParams('page', String(page + 1))}
                            >
                                Next →
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
