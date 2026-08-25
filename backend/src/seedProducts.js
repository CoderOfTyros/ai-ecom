// seed-products.js
// Seeds 40 products (10 per category) using real, recognizable product names.
// Edge cases baked in:
//   - out-of-stock items (stock_quantity: 0)   -> exercises the "Out of stock" badge
//   - null images                              -> exercises the "No Image" fallback
//   - draft / archived statuses                -> so you can test filtering to active-only
//   - wide price spread ($9.99 -> $2,599)      -> exercises formatPrice at all magnitudes
//
// Run:  node src/seedProducts.js   (or: npm run seed:products)
// Adjust the two import paths below to match your project structure.

import "dotenv/config"; // must be first: loads env before db.js reads process.env

import { sequelize } from "./db.js";
import Product from "./models/product.js";

// --- Images -----------------------------------------------------------------
// Using picsum.photos so every card renders during dev (deterministic per slug).
// Once you've uploaded real photos to ImageKit, switch `img` back to:
//   const IMAGEKIT_BASE = "https://ik.imagekit.io/ty4ugenzc/products";
//   const img = (slug) => `${IMAGEKIT_BASE}/${slug}.png`;
const img = (slug) => `https://picsum.photos/seed/${slug}/600/600`;

// --- Product data -----------------------------------------------------------
// image_url is derived from slug automatically.
// To leave an item imageless, set `image_url: null` explicitly.
const raw = [
  // ---- phones ----
  { slug: "iphone-15-pro-natural-titanium", name: "Apple iPhone 15 Pro (Natural Titanium)", description: "6.1-inch iPhone with the A17 Pro chip and a titanium frame.", price_cents: 99900, category: "phone", stock_quantity: 25 },
  { slug: "iphone-15-blue", name: "Apple iPhone 15 (Blue)", description: "6.1-inch iPhone with Dynamic Island and a 48MP main camera.", price_cents: 79900, category: "phone", stock_quantity: 40 },
  { slug: "samsung-galaxy-s24-ultra", name: "Samsung Galaxy S24 Ultra", description: "6.8-inch flagship with S Pen and a 200MP camera.", price_cents: 129900, category: "phone", stock_quantity: 0 },
  { slug: "samsung-galaxy-a55-5g", name: "Samsung Galaxy A55 5G", description: "Mid-range 5G phone with a 120Hz Super AMOLED display.", price_cents: 44900, category: "phone", stock_quantity: 60 },
  { slug: "google-pixel-8-pro", name: "Google Pixel 8 Pro", description: "Pixel flagship with the Tensor G3 chip and pro camera controls.", price_cents: 99900, category: "phone", stock_quantity: 15 },
  { slug: "google-pixel-8a", name: "Google Pixel 8a", description: "Affordable Pixel with 7 years of updates.", price_cents: 49900, category: "phone", stock_quantity: 30 },
  { slug: "oneplus-12", name: "OnePlus 12", description: "Fast flagship with 100W wired charging.", price_cents: 79900, category: "phone", stock_quantity: 8 },
  { slug: "nothing-phone-2", name: "Nothing Phone (2)", description: "Transparent design with the customizable Glyph interface.", price_cents: 59900, category: "phone", stock_quantity: 12 },
  { slug: "xiaomi-14", name: "Xiaomi 14", description: "Compact flagship with Leica-tuned cameras.", price_cents: 69900, category: "phone", stock_quantity: 0, status: "draft" },
  { slug: "motorola-edge-50", name: "Motorola Edge 50", description: "Curved pOLED display with a clean software experience.", price_cents: 39900, category: "phone", stock_quantity: 50, image_url: null },

  // ---- laptops ----
  { slug: "macbook-pro-16-m3-pro", name: "Apple MacBook Pro 16\" (M3 Pro)", description: "16-inch Liquid Retina XDR laptop for demanding workloads.", price_cents: 249900, category: "laptop", stock_quantity: 10 },
  { slug: "macbook-air-13-m3", name: "Apple MacBook Air 13\" (M3)", description: "Thin, fanless 13-inch laptop with all-day battery.", price_cents: 109900, category: "laptop", stock_quantity: 22 },
  { slug: "dell-xps-13", name: "Dell XPS 13", description: "Compact 13-inch ultrabook with an InfinityEdge display.", price_cents: 99900, category: "laptop", stock_quantity: 35 },
  { slug: "dell-xps-15", name: "Dell XPS 15", description: "15-inch creator laptop with a 3.5K OLED option.", price_cents: 189900, category: "laptop", stock_quantity: 7 },
  { slug: "asus-rog-zephyrus-g16", name: "ASUS ROG Zephyrus G16", description: "Slim 16-inch gaming laptop with an OLED display.", price_cents: 219900, category: "laptop", stock_quantity: 0 },
  { slug: "lenovo-thinkpad-x1-carbon", name: "Lenovo ThinkPad X1 Carbon", description: "Lightweight 14-inch business laptop with a legendary keyboard.", price_cents: 149900, category: "laptop", stock_quantity: 18 },
  { slug: "acer-chromebook-314", name: "Acer Chromebook 314", description: "Budget 14-inch Chromebook for browsing and docs.", price_cents: 29900, category: "laptop", stock_quantity: 45 },
  { slug: "hp-spectre-x360-14", name: "HP Spectre x360 14", description: "Convertible 2-in-1 with a 2.8K OLED touchscreen.", price_cents: 139900, category: "laptop", stock_quantity: 14, image_url: null },
  { slug: "razer-blade-15", name: "Razer Blade 15", description: "Premium 15-inch gaming laptop with a CNC aluminum chassis.", price_cents: 259900, category: "laptop", stock_quantity: 5 },
  { slug: "microsoft-surface-laptop-5", name: "Microsoft Surface Laptop 5", description: "13.5-inch touchscreen laptop with a clean Windows build.", price_cents: 99900, category: "laptop", stock_quantity: 0, status: "archived" },

  // ---- accessories ----
  { slug: "anker-65w-gan-charger", name: "Anker 65W GaN Charger", description: "Compact single-port USB-C fast charger.", price_cents: 4900, category: "accessory", stock_quantity: 100 },
  { slug: "anker-usb-c-cable-6ft", name: "Anker USB-C to USB-C Cable (6ft)", description: "Durable 100W USB-C charging and data cable.", price_cents: 1900, category: "accessory", stock_quantity: 200 },
  { slug: "sony-wh-1000xm5-headphones", name: "Sony WH-1000XM5 Headphones", description: "Over-ear headphones with class-leading noise cancellation.", price_cents: 39900, category: "accessory", stock_quantity: 55 },
  { slug: "apple-airpods-pro-2nd-gen", name: "Apple AirPods Pro (2nd Gen)", description: "In-ear buds with adaptive audio and active noise cancellation.", price_cents: 24900, category: "accessory", stock_quantity: 40 },
  { slug: "bellroy-laptop-sleeve-14", name: "Bellroy Laptop Sleeve 14\"", description: "Slim woven sleeve with a magnetic closure.", price_cents: 5900, category: "accessory", stock_quantity: 80 },
  { slug: "spigen-ultra-hybrid-clear-case", name: "Spigen Ultra Hybrid Clear Case", description: "Slim shock-absorbing clear phone case.", price_cents: 1500, category: "accessory", stock_quantity: 150 },
  { slug: "belkin-tempered-glass-screen-protector", name: "Belkin Tempered Glass Screen Protector", description: "Scratch-resistant glass with an easy-align tray.", price_cents: 1999, category: "accessory", stock_quantity: 0 },
  { slug: "anker-powercore-20000mah", name: "Anker PowerCore 20000mAh", description: "High-capacity power bank with fast charging.", price_cents: 5900, category: "accessory", stock_quantity: 33 },
  { slug: "anker-7-in-1-usb-c-hub", name: "Anker 7-in-1 USB-C Hub", description: "HDMI, USB-A, SD, and PD passthrough in one hub.", price_cents: 6900, category: "accessory", stock_quantity: 25 },
  { slug: "jbl-flip-6-speaker", name: "JBL Flip 6 Speaker", description: "Portable waterproof Bluetooth speaker.", price_cents: 12900, category: "accessory", stock_quantity: 60, status: "draft" },

  // ---- mice ----
  { slug: "logitech-mx-master-3s-black", name: "Logitech MX Master 3S (Black)", description: "Ergonomic wireless mouse with quiet clicks and 8K DPI.", price_cents: 9999, category: "mouse", stock_quantity: 70 },
  { slug: "logitech-mx-master-3s-pale-grey", name: "Logitech MX Master 3S (Pale Grey)", description: "The MX Master 3S in a pale grey finish.", price_cents: 9999, category: "mouse", stock_quantity: 65 },
  { slug: "logitech-lift-vertical-mouse", name: "Logitech Lift Vertical Mouse", description: "Vertical ergonomic mouse that reduces wrist strain.", price_cents: 6999, category: "mouse", stock_quantity: 30 },
  { slug: "razer-deathadder-v3-pro", name: "Razer DeathAdder V3 Pro", description: "Lightweight wireless esports mouse with a 30K sensor.", price_cents: 14999, category: "mouse", stock_quantity: 20 },
  { slug: "logitech-g-pro-x-superlight", name: "Logitech G Pro X Superlight", description: "Ultra-light 63g wireless gaming mouse.", price_cents: 15999, category: "mouse", stock_quantity: 0 },
  { slug: "logitech-m650-silent", name: "Logitech M650 Silent", description: "Quiet-click wireless mouse for shared spaces.", price_cents: 3999, category: "mouse", stock_quantity: 90 },
  { slug: "kensington-orbit-trackball", name: "Kensington Orbit Trackball", description: "Stationary trackball for precise, low-effort control.", price_cents: 4999, category: "mouse", stock_quantity: 12 },
  { slug: "logitech-m187-mini-mouse", name: "Logitech M187 Mini Mouse", description: "Compact wireless mouse for travel.", price_cents: 1999, category: "mouse", stock_quantity: 110, image_url: null },
  { slug: "razer-naga-v2-pro", name: "Razer Naga V2 Pro (MMO)", description: "Wireless MMO mouse with swappable side plates.", price_cents: 17999, category: "mouse", stock_quantity: 8 },
  { slug: "logitech-b100-optical-mouse", name: "Logitech B100 Optical Mouse", description: "Simple wired optical mouse.", price_cents: 999, category: "mouse", stock_quantity: 0, status: "archived" },
];

// Derive image_url from slug unless explicitly set to null; default status active.
const products = raw.map((p) => ({
  status: "active",
  ...p,
  image_url: p.image_url === null ? null : img(p.slug),
}));

// --- Seed runner ------------------------------------------------------------
async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Destructive: wipes the products table and resets the id sequence.
    // Fine for dev seeding; remove/guard this for anything you care about.
    await Product.destroy({ where: {}, truncate: true, restartIdentity: true, cascade: true });
    console.log("Cleared existing products.");

    const created = await Product.bulkCreate(products, { validate: true });
    console.log(`Seeded ${created.length} products across 4 categories.`);

    const outOfStock = products.filter((p) => p.stock_quantity <= 0).length;
    const noImage = products.filter((p) => p.image_url === null).length;
    const nonActive = products.filter((p) => p.status !== "active").length;
    console.log(`  out-of-stock: ${outOfStock}  |  no-image: ${noImage}  |  draft/archived: ${nonActive}`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    console.log("Connection closed.");
  }
}

seed();