/** Design tokens matching the UI_Instructions.md spec */

export const colors = {
    primary: {
        50: '#eef4ff',
        100: '#dbe7ff',
        200: '#bcd3ff',
        300: '#8fb4ff',
        400: '#5c8cff',
        500: '#2563eb',
        600: '#1e4fd6',
        700: '#1a3fae',
        800: '#1a378a',
        900: '#1b316f',
    },
    neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
    },
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    info: '#0ea5e9',
    white: '#ffffff',
} as const;

export const shadows = {
    soft: '0 4px 14px rgba(0,0,0,0.08)',
    hover: '0 8px 24px rgba(0,0,0,0.12)',
} as const;

export const radii = {
    card: '12px',
    button: '10px',
    input: '10px',
} as const;
