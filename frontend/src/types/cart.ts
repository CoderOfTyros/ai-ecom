export interface CartProduct {
    id: number;
    slug: string;
    name: string;
    price_cents: number;
    image_url: string | null;
    category: string;
    status: string;
    stock_quantity: number;
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: CartProduct;
}

export interface CartSummary {
    total_items: number;
    subtotal_cents: number;
}

export interface CartResponse {
    ok: true;
    items: CartItem[];
    summary: CartSummary;
}

export interface CartItemMutationResponse {
    ok: true;
    item: CartItem;
    total_items: number;
}

export interface DeleteCartItemResponse {
    ok: true;
    total_items: number;
}

export interface ClearCartResponse {
    ok: true;
    total_items: number;
}