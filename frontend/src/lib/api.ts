const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/** Get tokens from localStorage */
const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
};

const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

/** Try to refresh the access token */
const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${API_BASE}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            clearTokens();
            return null;
        }

        const data = await res.json();
        setTokens(data.accessToken, data.refreshToken);
        return data.accessToken;
    } catch {
        clearTokens();
        return null;
    }
};

interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

/**
 * Wrapper around fetch that handles auth headers and token refresh.
 */
export async function api<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth = false, headers: customHeaders, ...rest } = options;

    const headers: Record<string, string> = {
        ...(customHeaders as Record<string, string>),
    };

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!(rest.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (!skipAuth) {
        const token = getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    let res = await fetch(`${API_BASE}${endpoint}`, { ...rest, headers });

    // If 401, try refreshing the token once
    if (res.status === 401 && !skipAuth) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            res = await fetch(`${API_BASE}${endpoint}`, { ...rest, headers });
        }
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data as T;
}

export { getAccessToken, getRefreshToken, setTokens, clearTokens, API_BASE };
