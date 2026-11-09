import type { Pagination } from "@/types";

export interface ShippingAddress {
    full_name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    region?: string;
    postal_code?: string;
    country: string;
}

export interface OrderItem {
    id: number;
    product_id: number;
    product_snapshot: {
        id: number;
        slug: string;
        name: string;
        image_url: string | null;
        category: string;
    };
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
}

// One order, without its items (what GET /orders returns in its list)
export interface OrderSummary {
    id: number;
    user_id: number;
    status: "confirmed" | "cancelled";
    subtotal_cents: number;
    shipping_cents: number;
    total_cents: number;
    shipping_address: ShippingAddress | null;
    payment_method: "cod";
    payment_status: "unpaid" | "paid";
    created_at: string;
}

// One order with its items (POST /orders and GET /orders/:id)
export interface Order extends OrderSummary {
    items: OrderItem[];
}

export interface OrderResponse {
    ok: true;
    order: Order;
}

export interface OrdersListResponse {
    ok: true;
    orders: OrderSummary[];
    pagination: Pagination;
}
