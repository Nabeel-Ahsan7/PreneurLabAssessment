'use client';

import React from 'react';
import { colors, radii, shadows } from '@/lib/tokens';
import Button from './Button';

interface ModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
}

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    onConfirm,
    onCancel,
    danger = false,
}: ModalProps) {
    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)',
            }}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderRadius: radii.card,
                    boxShadow: shadows.hover,
                    padding: 32,
                    maxWidth: 420,
                    width: '90%',
                }}
            >
                <h3 style={{ margin: '0 0 8px', fontSize: 18, color: colors.neutral[900] }}>{title}</h3>
                <p style={{ margin: '0 0 24px', fontSize: 14, color: colors.neutral[600] }}>{message}</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
                </div>
            </div>
        </div>
    );
}
