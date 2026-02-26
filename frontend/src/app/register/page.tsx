'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors, radii, shadows } from '@/lib/tokens';

export default function RegisterPage() {
    const { register } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = 'Name is required';
        if (!email.trim()) e.email = 'Email is required';
        if (!password) e.password = 'Password is required';
        else if (password.length < 6) e.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await register(name, email, password);
            toast('Account created successfully!', 'success');
            router.push('/');
        } catch (err: any) {
            toast(err.message || 'Registration failed', 'error');
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
                    Create Account
                </h1>
                <p style={{ fontSize: 14, color: colors.neutral[500], marginBottom: 28, textAlign: 'center' }}>
                    Join PreneurShop today
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                    />
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
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                    />
                    <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 4 }}>
                        Create Account
                    </Button>
                </form>

                <p style={{ textAlign: 'center', fontSize: 14, color: colors.neutral[500], marginTop: 20 }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: colors.primary[500], fontWeight: 600, textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
