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
import './products.css';

export default function AdminProductsPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
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
        setExistingImages([]);
        setNewImageFiles([]);
        setEditing(null);
        setShowModal(false);
    };

    const openEdit = (product: Product) => {
        setEditing(product);
        setName(product.name);
        setPrice(String(product.price));
        setStock(String(product.stock));
        setDescription(product.description);
        setSelectedCategories(product.categories.map((c) => c._id));
        setExistingImages(product.images || []);
        setNewImageFiles([]);
        setShowModal(true);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImageFiles([...newImageFiles, ...filesArray]);
            e.target.value = ''; // Reset input to allow selecting same file again
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !stock || !description) {
            toast('All fields are required', 'warning');
            return;
        }

        if (existingImages.length === 0 && newImageFiles.length === 0) {
            toast('Please add at least one image', 'warning');
            return;
        }

        setSaving(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        formData.append('categories', JSON.stringify(selectedCategories));

        // For editing: send existing images that weren't deleted
        if (editing) {
            formData.append('existingImages', JSON.stringify(existingImages));
        }

        // Add new image files
        newImageFiles.forEach((file) => formData.append('images', file));

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.neutral[900], margin: 0 }}>Products</h1>
                <Button onClick={() => { resetForm(); setShowModal(true); }}>+ Add Product</Button>
            </div>

            {/* Product Form Modal */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.5)',
                        overflow: 'auto',
                        padding: '20px',
                    }}
                    onClick={resetForm}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#fff',
                            borderRadius: radii.card,
                            boxShadow: shadows.hover,
                            padding: 32,
                            maxWidth: 700,
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                    >
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: colors.neutral[900] }}>
                            {editing ? 'Edit Product' : 'New Product'}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Input label="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                            <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />

                            {/* Image Upload Section */}
                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <label style={{ fontSize: 14, fontWeight: 600, color: colors.neutral[900] }}>Product Images</label>
                                <p style={{ fontSize: 13, color: colors.neutral[500], margin: 0 }}>
                                    Upload multiple images. First image will be the main product image.
                                </p>

                                {/* Image Preview Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                                    {/* Existing Images */}
                                    {existingImages.map((img, index) => (
                                        <div
                                            key={`existing-${index}`}
                                            style={{
                                                position: 'relative',
                                                aspectRatio: '1',
                                                borderRadius: radii.input,
                                                overflow: 'hidden',
                                                border: `2px solid ${colors.neutral[200]}`,
                                            }}
                                        >
                                            <img
                                                src={`${API_BASE}${img}`}
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 16,
                                                    fontWeight: 700,
                                                    fontFamily: 'inherit',
                                                }}
                                            >
                                                ×
                                            </button>
                                            {index === 0 && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 4,
                                                        left: 4,
                                                        background: colors.primary[500],
                                                        color: '#fff',
                                                        fontSize: 10,
                                                        fontWeight: 600,
                                                        padding: '2px 6px',
                                                        borderRadius: 4,
                                                    }}
                                                >
                                                    Main
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* New Image Previews */}
                                    {newImageFiles.map((file, index) => (
                                        <div
                                            key={`new-${index}`}
                                            style={{
                                                position: 'relative',
                                                aspectRatio: '1',
                                                borderRadius: radii.input,
                                                overflow: 'hidden',
                                                border: `2px solid ${colors.primary[300]}`,
                                            }}
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 16,
                                                    fontWeight: 700,
                                                    fontFamily: 'inherit',
                                                }}
                                            >
                                                ×
                                            </button>
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 4,
                                                    left: 4,
                                                    background: colors.success,
                                                    color: '#fff',
                                                    fontSize: 10,
                                                    fontWeight: 600,
                                                    padding: '2px 6px',
                                                    borderRadius: 4,
                                                }}
                                            >
                                                New
                                            </div>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    <label
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: radii.input,
                                            border: `2px dashed ${colors.neutral[300]}`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            background: colors.neutral[50],
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = colors.primary[400];
                                            e.currentTarget.style.background = colors.primary[50];
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = colors.neutral[300];
                                            e.currentTarget.style.background = colors.neutral[50];
                                        }}
                                    >
                                        <span style={{ fontSize: 32, marginBottom: 4 }}>+</span>
                                        <span style={{ fontSize: 11, color: colors.neutral[600], textAlign: 'center', padding: '0 8px' }}>
                                            Add Image
                                        </span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
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
                </div>
            )}

            {/* Products list - responsive table/cards */}
            {products.length === 0 ? (
                <EmptyState message="No products yet. Create your first product!" icon="📦" />
            ) : (
                <>
                    {/* Desktop table - hidden on mobile */}
                    <div
                        className="desktop-table"
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
                                        <td style={tdStyle}>৳{p.price.toFixed(2)}</td>
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

                    {/* Mobile cards - hidden on desktop */}
                    <div className="mobile-cards" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {products.map((p) => (
                            <div
                                key={p._id}
                                style={{
                                    background: '#fff',
                                    border: `1px solid ${colors.neutral[200]}`,
                                    borderRadius: radii.card,
                                    padding: 16,
                                    display: 'flex',
                                    gap: 12,
                                }}
                            >
                                <div style={{ width: 80, height: 80, borderRadius: 8, background: colors.neutral[100], overflow: 'hidden', flexShrink: 0 }}>
                                    {p.images?.[0] ? (
                                        <img src={`${API_BASE}${p.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: colors.neutral[300] }}>📷</span>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.neutral[900], margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h3>
                                    <div style={{ display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 14, color: colors.neutral[700] }}>৳{p.price.toFixed(2)}</span>
                                        <span style={{ fontSize: 14, color: p.stock <= 5 ? colors.warning : colors.neutral[700] }}>Stock: {p.stock}</span>
                                    </div>
                                    {p.categories && p.categories.length > 0 && (
                                        <div style={{ fontSize: 13, color: colors.neutral[500], marginBottom: 12 }}>
                                            {p.categories.map((c) => c.name).join(', ')}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(p)}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
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
