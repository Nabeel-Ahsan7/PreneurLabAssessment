'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors, radii, shadows } from '@/lib/tokens';

export default function LoginPage() {
    const { login } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const e: typeof errors = {};
        if (!email.trim()) e.email = 'Email is required';
        if (!password) e.password = 'Password is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password);
            toast('Welcome back!', 'success');
            router.push('/');
        } catch (err: any) {
            toast(err.message || 'Login failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div
                style={{
                    width: '100%',
                    maxWidth: 420,
                    background: '#fff',
                    border: `1px solid ${colors.neutral[200]}`,
                    borderRadius: radii.card,
                    boxShadow: shadows.soft,
                    padding: 36,
                }}
            >
                <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.neutral[900], marginBottom: 8, textAlign: 'center' }}>
                    Welcome Back
                </h1>
                <p style={{ fontSize: 14, color: colors.neutral[500], marginBottom: 28, textAlign: 'center' }}>
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                    <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 4 }}>
                        Sign In
                    </Button>
                </form>

                <p style={{ textAlign: 'center', fontSize: 14, color: colors.neutral[500], marginTop: 20 }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" style={{ color: colors.primary[500], fontWeight: 600, textDecoration: 'none' }}>
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
