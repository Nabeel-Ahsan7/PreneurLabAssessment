'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { PageLoading, EmptyState } from '@/components/ui/Loading';
import { colors, radii, shadows } from '@/lib/tokens';
import type { ReportSummary } from '@/types';

export default function AdminReportsPage() {
    const { toast } = useToast();
    const [report, setReport] = useState<ReportSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api<ReportSummary>('/reports/summary')
            .then(setReport)
            .catch(() => toast('Failed to load report', 'error'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <PageLoading />;
    if (!report) return <EmptyState message="No report data available" icon="📈" />;

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.neutral[900], marginBottom: 24 }}>Reports</h1>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div
                    style={{
                        padding: 24,
                        background: '#fff',
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: radii.card,
                        boxShadow: shadows.soft,
                    }}
                >
                    <p style={{ fontSize: 13, color: colors.neutral[500], margin: 0 }}>Total Orders</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: colors.neutral[900], margin: '8px 0 0' }}>
                        {report.totalOrders}
                    </p>
                </div>
                <div
                    style={{
                        padding: 24,
                        background: '#fff',
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: radii.card,
                        boxShadow: shadows.soft,
                    }}
                >
                    <p style={{ fontSize: 13, color: colors.neutral[500], margin: 0 }}>Total Revenue</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: colors.success, margin: '8px 0 0' }}>
                        ৳{report.totalRevenue.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Top products */}
            <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.neutral[800], marginBottom: 16 }}>
                Top 3 Best-Selling Products
            </h2>
            {report.topProducts.length === 0 ? (
                <EmptyState message="No sales data yet" icon="📊" />
            ) : (
                <div
                    style={{
                        background: '#fff',
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: radii.card,
                        overflow: 'hidden',
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: colors.neutral[50] }}>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>Product</th>
                                <th style={thStyle}>Units Sold</th>
                                <th style={thStyle}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.topProducts.map((p, i) => (
                                <tr key={p.productId} style={{ borderTop: `1px solid ${colors.neutral[100]}` }}>
                                    <td style={tdStyle}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: i === 0 ? colors.warning : colors.neutral[100],
                                            color: i === 0 ? '#fff' : colors.neutral[600],
                                            fontSize: 13,
                                            fontWeight: 700,
                                        }}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{p.name}</td>
                                    <td style={tdStyle}>{p.totalSold}</td>
                                    <td style={{ ...tdStyle, fontWeight: 600, color: colors.success }}>৳{p.totalRevenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
};

const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: 14,
    color: colors.neutral[700],
};
