'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { PageLoading, EmptyState } from '@/components/ui/Loading';
import { colors, radii, shadows } from '@/lib/tokens';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    const fetchCategories = async () => {
        try {
            const data = await api<Category[]>('/categories', { skipAuth: true });
            setCategories(data);
        } catch {
            toast('Failed to load categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { toast('Name is required', 'warning'); return; }
        setSaving(true);
        try {
            await api('/categories', { method: 'POST', body: JSON.stringify({ name }) });
            toast('Category created!', 'success');
            setName('');
            fetchCategories();
        } catch (err: any) {
            toast(err.message || 'Failed to create', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) { toast('Name is required', 'warning'); return; }
        try {
            await api(`/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name: editName }) });
            toast('Category updated!', 'success');
            setEditingId(null);
            fetchCategories();
        } catch (err: any) {
            toast(err.message || 'Failed to update', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await api(`/categories/${deleteTarget._id}`, { method: 'DELETE' });
            toast('Category deleted', 'info');
            setDeleteTarget(null);
            fetchCategories();
        } catch (err: any) {
            toast(err.message || 'Failed to delete', 'error');
        }
    };

    if (loading) return <PageLoading />;

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.neutral[900], marginBottom: 24 }}>Categories</h1>

            {/* Create form */}
            <form
                onSubmit={handleCreate}
                style={{
                    display: 'flex',
                    gap: 12,
                    marginBottom: 24,
                    padding: 20,
                    background: '#fff',
                    border: `1px solid ${colors.neutral[200]}`,
                    borderRadius: radii.card,
                    boxShadow: shadows.soft,
                    alignItems: 'flex-end',
                }}
            >
                <div style={{ flex: 1 }}>
                    <Input label="New Category" placeholder="e.g. Electronics" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <Button type="submit" loading={saving}>Add</Button>
            </form>

            {/* List */}
            {categories.length === 0 ? (
                <EmptyState message="No categories yet. Create your first one!" icon="🏷️" />
            ) : (
                <div
                    style={{
                        background: '#fff',
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: radii.card,
                        overflow: 'hidden',
                    }}
                >
                    {categories.map((cat, i) => (
                        <div
                            key={cat._id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 20px',
                                borderTop: i > 0 ? `1px solid ${colors.neutral[100]}` : 'none',
                            }}
                        >
                            {editingId === cat._id ? (
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleUpdate(cat._id); }}
                                        autoFocus
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: radii.input,
                                            border: `1px solid ${colors.primary[500]}`,
                                            fontSize: 14,
                                            fontFamily: 'inherit',
                                            outline: 'none',
                                            flex: 1,
                                        }}
                                    />
                                    <Button size="sm" onClick={() => handleUpdate(cat._id)}>Save</Button>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <span style={{ fontWeight: 500, fontSize: 15, color: colors.neutral[800] }}>{cat.name}</span>
                                        <span style={{ fontSize: 12, color: colors.neutral[400], marginLeft: 8 }}>/{cat.slug}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => { setEditingId(cat._id); setEditName(cat.name); }}
                                        >
                                            Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(cat)}>Delete</Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                open={!!deleteTarget}
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                danger
            />
        </div>
    );
}
