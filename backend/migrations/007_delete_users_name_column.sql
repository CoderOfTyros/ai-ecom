TRUNCATE TABLE
    order_items,
    cart_items,
    orders,
    users
RESTART IDENTITY;

ALTER TABLE users
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;