export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    createdAt: string;
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    images: string[];
    categories: Category[];
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    _id?: string;
    user: string;
    items: CartItem[];
}

export interface OrderItem {
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface ProductsResponse {
    products: Product[];
    pagination: PaginationInfo;
}

export interface AuthResponse {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface ReportSummary {
    totalOrders: number;
    totalRevenue: number;
    topProducts: {
        productId: string;
        name: string;
        totalSold: number;
        totalRevenue: number;
    }[];
}

export interface Recommendation extends Product {
    reason: string;
}
