'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                <ScrollToTop />
                <Navbar />
                <main style={{ minHeight: 'calc(100vh - 140px)' }}>
                    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px' }}>
                        {children}
                    </div>
                </main>
                <Footer />
            </ToastProvider>
        </AuthProvider>
    );
}
