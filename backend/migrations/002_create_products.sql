CREATE TYPE enum_products_status AS ENUM('active', 'draft', 'archived');


CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(180) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL CHECK(price_cents >= 0),
    image_url TEXT,
    category VARCHAR(80) NOT NULL DEFAULT 'general',
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity >= 0),
    status enum_products_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$  -- trigger type is a special PostgreSQL function return type used only for functions that are executed by triggers.
BEGIN 
   NEW.updated_at = NOW(); -- NEW = the row about to be written
   RETURN NEW;
END;
$$   LANGUAGE plpgsql; -- tells postgres this is written in PL/pgSQL

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();



