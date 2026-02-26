'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { colors, radii, shadows } from '@/lib/tokens';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const bgMap: Record<ToastType, string> = {
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
    };

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        style={{
                            padding: '12px 20px',
                            background: bgMap[t.type],
                            color: '#fff',
                            borderRadius: radii.button,
                            boxShadow: shadows.hover,
                            fontSize: 14,
                            fontWeight: 500,
                            animation: 'fadeIn 0.2s ease',
                            maxWidth: 360,
                        }}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}
