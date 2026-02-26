'use client';

import { colors } from '@/lib/tokens';

export function Spinner({ size = 32 }: { size?: number }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                border: `3px solid ${colors.neutral[200]}`,
                borderTopColor: colors.primary[500],
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
            }}
        />
    );
}

export function PageLoading() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <Spinner size={40} />
        </div>
    );
}

export function EmptyState({ message, icon }: { message: string; icon?: string }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 60,
                color: colors.neutral[400],
                textAlign: 'center',
                gap: 12,
            }}
        >
            <span style={{ fontSize: 48 }}>{icon || '📦'}</span>
            <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>{message}</p>
        </div>
    );
}
