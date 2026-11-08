import { z } from "zod";

// Limits used in more than one place
export const CART_MAX_QUANTITY = 99;
const MAX_INT = 2147483647; // biggest Postgres INTEGER

// Integer from a URL or JSON body. z.coerce turns "5" into 5.
const int = (min, max) => z.coerce.number().int().min(min).max(max);

// ---------- shared ----------

// Route params like /orders/:id
export const idParam = z.object({ id: int(1, MAX_INT) });
export const itemIdParam = z.object({ itemId: int(1, MAX_INT) });

// ---------- auth ----------

export const registerBody = z.object({
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().toLowerCase().email("Valid email required"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export const loginBody = z.object({
    email: z.string().trim().toLowerCase().min(1, "Email required"),
    password: z.string().min(1, "Password required")
});

// ---------- products ----------

export const productListQuery = z.object({
    page: int(1, 100000).default(1),
    limit: int(1, 50).default(12),
    category: z.string().trim().toLowerCase().optional(),
    search: z.string().trim().optional(),
    sort: z.enum(["newest", "oldest", "price_asc", "price_desc"]).default("newest"),
    min_price: int(0, MAX_INT).optional(),
    max_price: int(0, MAX_INT).optional()
});

// ---------- cart ----------

export const addCartItemBody = z.object({
    product_id: int(1, MAX_INT),
    quantity: int(1, CART_MAX_QUANTITY).default(1)
});

export const updateCartItemBody = z.object({
    quantity: int(1, CART_MAX_QUANTITY)
});

// ---------- orders ----------

export const orderListQuery = z.object({
    page: int(1, 100000).default(1),
    limit: int(1, 50).default(10)
});

export const adminOrderListQuery = z.object({
    page: int(1, 100000).default(1),
    limit: int(1, 50).default(20),
    status: z.enum(["confirmed", "cancelled"]).optional(),
    user_id: int(1, MAX_INT).optional()
});

// Shipping address for checkout.
// postal_code is optional: many addresses (e.g. in Lebanon) do not use one.
const requiredText = (max) => z.string("This field is required")
    .trim()
    .min(1, "This field is required")
    .max(max, `Maximum ${max} characters`);

const optionalText = (max) => z.string("Must be text")
    .trim()
    .max(max, `Maximum ${max} characters`)
    .optional();

export const shippingAddress = z.object({
    full_name: requiredText(100),
    phone: requiredText(30),
    line1: requiredText(200),
    line2: optionalText(200),
    city: requiredText(100),
    region: optionalText(100),
    postal_code: optionalText(30),
    country: requiredText(100)
});

export const orderStatusBody = z.object({
    status: z.enum(["confirmed", "cancelled"])
});

// ---------- admin products ----------

export const createProductBody = z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens (e.g. gaming-mouse)"),
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().nullable().optional(),
    price_cents: z.number().int().min(0),
    image_url: z.string().trim().nullable().optional(),
    category: z.string().trim().min(1).optional(),
    stock_quantity: z.number().int().min(0).optional()
});

// PATCH: same fields, but all optional
export const updateProductBody = createProductBody.partial();

export const productStatusBody = z.object({
    status: z.enum(["active", "draft", "archived"])
});
