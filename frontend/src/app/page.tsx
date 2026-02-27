'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import { useToast } from '@/components/ui/Toast';
import ProductCard from '@/components/products/ProductCard';
import { PageLoading } from '@/components/ui/Loading';
import AddedToCartModal from '@/components/ui/AddedToCartModal';
import { colors } from '@/lib/tokens';
import type { Product, Recommendation } from '@/types';

export default function HomePage() {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api<{ products: Product[] }>('/products?limit=8', { skipAuth: true });
        setFeatured(res.products);

        if (user) {
          try {
            const recs = await api<Recommendation[]>('/recommendations');
            setRecommendations(recs);
          } catch { /* ignore */ }
        }
      } catch {
        toast('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleAddToCart = async (productId: string) => {
    if (!user) { router.push('/login'); return; }
    setAddingId(productId);
    try {
      await api('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity: 1 }) });
      await refreshCart(); // Update cart count immediately
      const product = [...featured, ...recommendations].find(p => p._id === productId);
      setAddedProductName(product?.name || '');
      setShowAddedModal(true);
    } catch (err: any) {
      toast(err.message || 'Failed to add to cart', 'error');
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div>
      <AddedToCartModal
        open={showAddedModal}
        onClose={() => setShowAddedModal(false)}
        productName={addedProductName}
      />
      <section style={{ textAlign: 'center', padding: '48px 0 40px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: colors.neutral[900], marginBottom: 12 }}>
          Welcome to NabeelShop
        </h1>
        <p style={{ fontSize: 16, color: colors.neutral[500], maxWidth: 520, margin: '0 auto 24px' }}>
          Discover quality products at great prices. Shop with confidence.
        </p>
        <button
          onClick={() => router.push('/products')}
          style={{
            padding: '12px 32px',
            background: colors.primary[500],
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Browse All Products
        </button>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.neutral[900], marginBottom: 20 }}>
          Latest Products
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} addingToCart={addingId === p._id} />
          ))}
        </div>
      </section>

      {recommendations.length > 0 && (
        <section>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.neutral[900], marginBottom: 20 }}>
            Recommended for You
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {recommendations.slice(0, 4).map((rec) => (
              <ProductCard key={rec._id} product={rec} onAddToCart={handleAddToCart} addingToCart={addingId === rec._id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
