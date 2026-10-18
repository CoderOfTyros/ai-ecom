ALTER TABLE orders
    ADD COLUMN shipping_address JSONB NOT NULL,

    ADD COLUMN shipping_cents INTEGER NOT NULL DEFAULT 0
        CHECK (shipping_cents >= 0),

    ADD COLUMN total_cents INTEGER NOT NULL
        CHECK (total_cents >= 0),

    ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'cod'
        CHECK (payment_method IN ('cod')),

    ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid', 'paid')),

    ADD CONSTRAINT orders_total_check
        CHECK (total_cents = subtotal_cents + shipping_cents);