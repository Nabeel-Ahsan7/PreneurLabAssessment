'use client';

import React from 'react';
import { colors, radii } from '@/lib/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    style,
    ...props
}: ButtonProps) {
    const baseStyle: React.CSSProperties = {
        borderRadius: radii.button,
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.15s ease',
        opacity: disabled || loading ? 0.6 : 1,
        fontFamily: 'inherit',
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
        sm: { padding: '8px 16px', fontSize: 13 },
        md: { padding: '10px 20px', fontSize: 14 },
        lg: { padding: '12px 28px', fontSize: 16 },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: { background: colors.primary[500], color: '#fff' },
        secondary: { background: colors.neutral[100], color: colors.neutral[800], border: `1px solid ${colors.neutral[300]}` },
        danger: { background: colors.error, color: '#fff' },
        ghost: { background: 'transparent', color: colors.neutral[700] },
    };

    return (
        <button
            disabled={disabled || loading}
            style={{ ...baseStyle, ...sizeStyles[size], ...variantStyles[variant], ...style }}
            onMouseEnter={(e) => {
                if (variant === 'primary') e.currentTarget.style.background = colors.primary[600];
            }}
            onMouseLeave={(e) => {
                if (variant === 'primary') e.currentTarget.style.background = colors.primary[500];
            }}
            {...props}
        >
            {loading && (
                <span
                    style={{
                        width: 16,
                        height: 16,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                        display: 'inline-block',
                    }}
                />
            )}
            {children}
        </button>
    );
}
