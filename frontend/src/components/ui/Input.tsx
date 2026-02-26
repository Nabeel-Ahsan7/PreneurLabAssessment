'use client';

import React from 'react';
import { colors, radii } from '@/lib/tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, style, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {label && (
                    <label
                        htmlFor={inputId}
                        style={{ fontSize: 14, fontWeight: 500, color: colors.neutral[700] }}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    aria-label={label}
                    aria-invalid={!!error}
                    style={{
                        padding: '10px 14px',
                        borderRadius: radii.input,
                        border: `1px solid ${error ? colors.error : colors.neutral[300]}`,
                        fontSize: 14,
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                        fontFamily: 'inherit',
                        color: colors.neutral[900],
                        ...style,
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = error ? colors.error : colors.primary[500];
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = error ? colors.error : colors.neutral[300];
                    }}
                    {...props}
                />
                {error && (
                    <span style={{ fontSize: 12, color: colors.error }}>{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
