'use client';

import { colors } from '@/lib/tokens';

export default function Footer() {
    return (
        <footer
            style={{
                borderTop: `1px solid ${colors.neutral[200]}`,
                padding: '24px 0',
                marginTop: 48,
                textAlign: 'center',
            }}
        >
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <p style={{ fontSize: 13, color: colors.neutral[400], margin: 0 }}>
                    © {new Date().getFullYear()} PreneurShop. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
