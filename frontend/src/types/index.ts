export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_admin: boolean;
}

export interface ApiErrorResponse {
    ok: false;
    error: string;
    code: string;
    details?: {
        fields?: Record<string, string>
    };
}


export interface Product {
    id: number;
    slug: string;
    name: string;
    description?: string | null;
    price_cents: number;
    image_url: string | null;
    category: string;
    stock_quantity: number;
    status: "active" | "draft" | "archived";
    created_at: string;
    updated_at: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}