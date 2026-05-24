import "dotenv/config";
import { sequelize } from "./db.js";


const products = [
    {
        slug: "classic-black-tshirt",
        name: "Classic Black T-Shirt",
        description: "A comfortable everyday black cotton t-shirt.",
        price_cents: 1999,
        image_url: "https://placehold.co/600x400?text=Black+T-Shirt",
        category: "clothing",
        stock_quantity: 50
    },
    {
        slug: "white-sneakers",
        name: "White Sneakers",
        description: "Minimal white sneakers for casual outfits.",
        price_cents: 6499,
        image_url: "https://placehold.co/600x400?text=White+Sneakers",
        category: "shoes",
        stock_quantity: 20
    },
    {
        slug: "leather-wallet",
        name: "Leather Wallet",
        description: "Compact wallet with multiple card slots.",
        price_cents: 2999,
        image_url: "https://placehold.co/600x400?text=Wallet",
        category: "accessories",
        stock_quantity: 35
    },
    {
        slug: "wireless-headphones",
        name: "Wireless Headphones",
        description: "Bluetooth headphones with long battery life.",
        price_cents: 8999,
        image_url: "https://placehold.co/600x400?text=Headphones",
        category: "electronics",
        stock_quantity: 15
    },
    {
        slug: "desk-lamp",
        name: "Desk Lamp",
        description: "Adjustable LED desk lamp for studying and work.",
        price_cents: 2499,
        image_url: "https://placehold.co/600x400?text=Desk+Lamp",
        category: "home",
        stock_quantity: 40
    }
];

async function main() {
    await sequelize.authenticate();
    const t = await sequelize.transaction();

    try {
        for (const product of products) {
            await sequelize.query(`
            INSERT INTO products (slug, name, description, price_cents, image_url, category, stock_quantity, status)   
            VALUES (:slug, :name, :description, :price_cents, :image_url, :category, :stock_quantity, 'active')

            ON CONFLICT (slug) 
            DO UPDATE SET 
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                price_cents = EXCLUDED.price_cents,
                image_url = EXCLUDED.image_url,
                category = EXCLUDED.category,
                stock_quantity = EXCLUDED.stock_quantity,
                status = EXCLUDED.status,
                updated_at = NOW();
                `, {
                replacements: product,
                transaction: t
            });
        }
        await t.commit();
        console.log(`Successfuly seeded ${products.length} products`);
    } catch (err) {
        t.rollback();
        throw err;
    } finally {
        await sequelize.close();
    }
}

main().catch((err) => {
    console.error("Product seed failed:", err);
    process.exit(1);
});