'use client';

import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                <ToastProvider>
                    <Navbar />
                    <main style={{ minHeight: 'calc(100vh - 140px)' }}>
                        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px' }}>
                            {children}
                        </div>
                    </main>
                    <Footer />
                </ToastProvider>
            </CartProvider>
        </AuthProvider>
    );
}
