'use client';

import { useEffect, useState } from 'react';
import { api, API_BASE } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { PageLoading, EmptyState } from '@/components/ui/Loading';
import { colors, radii, shadows } from '@/lib/tokens';
import type { Product, Category } from '@/types';

export default function AdminProductsPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [images, setImages] = useState<FileList | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await api<{ products: Product[] }>('/products?limit=50');
            setProducts(res.products);
        } catch {
            toast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        api<Category[]>('/categories', { skipAuth: true }).then(setCategories).catch(() => { });
    }, []);

    const resetForm = () => {
        setName('');
        setPrice('');
        setStock('');
        setDescription('');
        setSelectedCategories([]);
        setImages(null);
        setEditing(null);
        setShowForm(false);
    };

    const openEdit = (product: Product) => {
        setEditing(product);
        setName(product.name);
        setPrice(String(product.price));
        setStock(String(product.stock));
        setDescription(product.description);
        setSelectedCategories(product.categories.map((c) => c._id));
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !stock || !description) {
            toast('All fields are required', 'warning');
            return;
        }

        setSaving(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        formData.append('categories', JSON.stringify(selectedCategories));
        if (images) {
            Array.from(images).forEach((file) => formData.append('images', file));
        }

        try {
            if (editing) {
                await api(`/products/${editing._id}`, { method: 'PUT', body: formData });
                toast('Product updated!', 'success');
            } else {
                await api('/products', { method: 'POST', body: formData });
                toast('Product created!', 'success');
            }
            resetForm();
            fetchProducts();
        } catch (err: any) {
            toast(err.message || 'Failed to save product', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await api(`/products/${deleteTarget._id}`, { method: 'DELETE' });
            toast('Product deleted', 'info');
            setDeleteTarget(null);
            fetchProducts();
        } catch (err: any) {
            toast(err.message || 'Failed to delete', 'error');
        }
    };

    if (loading) return <PageLoading />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.neutral[900], margin: 0 }}>Products</h1>
                <Button onClick={() => { resetForm(); setShowForm(true); }}>+ Add Product</Button>
            </div>

            {/* Form */}
            {showForm && (
                <div
                    style={{
                        padding: 24,
                        background: '#fff',
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: radii.card,
                        boxShadow: shadows.soft,
                        marginBottom: 24,
                    }}
                >
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: colors.neutral[800] }}>
                        {editing ? 'Edit Product' : 'New Product'}
                    </h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input label="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                        <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 14, fontWeight: 500, color: colors.neutral[700] }}>Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setImages(e.target.files)}
                                style={{ fontSize: 14 }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 14, fontWeight: 500, color: colors.neutral[700] }}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: radii.input,
                                    border: `1px solid ${colors.neutral[300]}`,
                                    fontSize: 14,
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 14, fontWeight: 500, color: colors.neutral[700] }}>Categories</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {categories.map((cat) => {
                                    const selected = selectedCategories.includes(cat._id);
                                    return (
                                        <button
                                            key={cat._id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategories(
                                                    selected
                                                        ? selectedCategories.filter((id) => id !== cat._id)
                                                        : [...selectedCategories, cat._id]
                                                );
                                            }}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: 20,
                                                border: `1px solid ${selected ? colors.primary[500] : colors.neutral[300]}`,
                                                background: selected ? colors.primary[50] : '#fff',
                                                color: selected ? colors.primary[700] : colors.neutral[600],
                                                fontSize: 13,
                                                cursor: 'pointer',
                                                fontWeight: selected ? 600 : 400,
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
                            <Button type="submit" loading={saving}>{editing ? 'Update' : 'Create'}</Button>
                            <Button variant="secondary" type="button" onClick={resetForm}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Products table */}
            {products.length === 0 ? (
                <EmptyState message="No products yet. Create your first product!" icon="📦" />
            ) : (
                <div
                    style={{
                        background: '#fff',
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: radii.card,
                        overflow: 'hidden',
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: colors.neutral[50] }}>
                                <th style={thStyle}>Image</th>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Price</th>
                                <th style={thStyle}>Stock</th>
                                <th style={thStyle}>Categories</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id} style={{ borderTop: `1px solid ${colors.neutral[100]}` }}>
                                    <td style={tdStyle}>
                                        <div style={{ width: 40, height: 40, borderRadius: 6, background: colors.neutral[100], overflow: 'hidden' }}>
                                            {p.images?.[0] ? (
                                                <img src={`${API_BASE}${p.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: colors.neutral[300] }}>📷</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 500 }}>{p.name}</td>
                                    <td style={tdStyle}>${p.price.toFixed(2)}</td>
                                    <td style={tdStyle}>
                                        <span style={{ color: p.stock <= 5 ? colors.warning : colors.neutral[700] }}>{p.stock}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        {p.categories?.map((c) => c.name).join(', ') || '—'}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                            <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                                            <Button variant="danger" size="sm" onClick={() => setDeleteTarget(p)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                open={!!deleteTarget}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                danger
            />
        </div>
    );
}

const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
};

const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: 14,
    color: colors.neutral[700],
};
