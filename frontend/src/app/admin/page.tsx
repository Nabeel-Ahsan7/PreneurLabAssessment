'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { PageLoading } from '@/components/ui/Loading';
import { colors, radii, shadows } from '@/lib/tokens';
import type { ReportSummary } from '@/types';

export default function AdminDashboard() {
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

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.neutral[900], marginBottom: 24 }}>Dashboard</h1>

            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard label="Total Orders" value={report?.totalOrders ?? 0} icon="📦" />
                <StatCard label="Total Revenue" value={`৳${(report?.totalRevenue ?? 0).toFixed(2)}`} icon="💰" />
                <StatCard label="Top Products" value={report?.topProducts?.length ?? 0} icon="⭐" />
            </div>

            {/* Top products */}
            {report?.topProducts && report.topProducts.length > 0 && (
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.neutral[800], marginBottom: 16 }}>
                        Best Selling Products
                    </h2>
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
                                    <th style={thStyle}>Product</th>
                                    <th style={thStyle}>Units Sold</th>
                                    <th style={thStyle}>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.topProducts.map((p, i) => (
                                    <tr key={p.productId} style={{ borderTop: `1px solid ${colors.neutral[100]}` }}>
                                        <td style={tdStyle}>{p.name}</td>
                                        <td style={tdStyle}>{p.totalSold}</td>
                                        <td style={tdStyle}>৳{p.totalRevenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
    return (
        <div
            style={{
                padding: 20,
                background: '#fff',
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: radii.card,
                boxShadow: shadows.soft,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontSize: 13, color: colors.neutral[500], margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: colors.neutral[900], margin: '4px 0 0' }}>{value}</p>
                </div>
                <span style={{ fontSize: 28 }}>{icon}</span>
            </div>
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
