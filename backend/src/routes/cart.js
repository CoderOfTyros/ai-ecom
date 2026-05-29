import express from "express";
import { CartItem, Product } from "../models/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { readIntQuery } from "../utils/readIntQuery.js";
import { HttpError } from "../errors/HttpError.js";

const router = express.Router();

const CART_PRODUCT_FIELDS = ["id", "slug", "name", "price_cents", "image_url", "category", "status"];

function summarize(items) {
    let totalItems = 0;
    let subtotalCents = 0;

    for (const item of items) {
        const plainItem = item.toJSON(); // converts sequelize object into plain js object
        totalItems += plainItem.quantity;
        subtotalCents += plainItem.quantity * plainItem.product.price_cents;
    }

    return { total_items: totalItems, subtotal_cents: subtotalCents };
}

async function fetchItemWithProduct(id, userId) {
    return CartItem.findOne({
        where: { id, user_id: userId },
        include: [{
            model: Product,
            as: "product",
            attributes: CART_PRODUCT_FIELDS
        }]
    });
}

async function findActiveProduct(productId) {
    const product = await Product.findOne({
        where: { id: productId, status: "active" }
    });

    if (!product) {
        throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    return product;
}

function assertStock(product, requestedQuantity) {
    if (requestedQuantity > product.stock_quantity) {
        throw new HttpError(409, "Not enough stock", "INSUFFICIENT_STOCK", {
            fields: {
                quantity: `Only ${product.stock_quantity} available`
            }
        });
    }
}

// ROUTES

router.get("/", requireAuth, asyncHandler(async (req, res) => {
    const items = await CartItem.findAll({
        where: { user_id: req.userId },
        include: [{
            model: Product,
            as: "product",
            attributes: CART_PRODUCT_FIELDS,
            where: { status: "active" },
            required: true
        }],
        order: [["created_at", "DESC"]]
    });

    res.json({
        ok: true,
        items,
        summary: summarize(items)
    });
}
));


router.post("/items", requireAuth, asyncHandler(async (req, res) => {
    const productId = readIntQuery(req.body?.product_id, {
        name: "product_id", defaultValue: undefined, min: 1, max: 2147483647
    });
    if (productId === undefined) {
        throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", {
            fields: { product_id: "Product id is required" }
        });
    }
    const quantity = readIntQuery(req.body?.quantity, {
        name: "quantity", defaultValue: 1, min: 1, max: 99
    });

    const product = await findActiveProduct(productId);

    const existingItem = await CartItem.findOne({
        where: { user_id: req.userId, product_id: productId }
    });

    if (existingItem) {
        const newQuantity = quantity + existingItem.quantity;

        if (newQuantity > 99) {
            throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", {
                fields: {
                    quantity: "Cart item quantity cannot exceed 99"
                }
            });
        }

        assertStock(product, newQuantity);

        existingItem.quantity = newQuantity;
        await existingItem.save();

        const item = await fetchItemWithProduct(existingItem.id, req.userId);
        return res.status(200).json({ ok: true, item });

    }
    assertStock(product, quantity);
    const created = await CartItem.create({
        user_id: req.userId,
        product_id: productId,
        quantity
    });

    const item = await fetchItemWithProduct(created.id, req.userId);
    res.status(201).json({ ok: true, item });

}));


router.patch("/items/:itemId", requireAuth, asyncHandler(async (req, res) => {
    const itemId = readIntQuery(req.params.itemId, {
        name: "item_id", defaultValue: undefined, min: 1, max: 2147483647
    });

    const quantity = readIntQuery(req.body?.quantity, {
        name: "quantity", defaultValue: undefined, min: 1, max: 99
    });

    if (quantity === undefined) {
        throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", {
            fields: { quantity: "Quantity is required" }
        });
    }

    const existingItem = await CartItem.findOne({
        where: { id: itemId, user_id: req.userId }
    });

    if (!existingItem) {
        throw new HttpError(404, "Cart item not found", "CART_ITEM_NOT_FOUND");
    }

    const product = await findActiveProduct(existingItem.product_id);
    assertStock(product, quantity);

    existingItem.quantity = quantity;
    await existingItem.save();

    const item = await fetchItemWithProduct(existingItem.id, req.userId);

    res.json({ ok: true, item });
}));

router.delete("/items/:itemId", requireAuth, asyncHandler(async (req, res) => {
    const itemId = readIntQuery(req.params.itemId, {
        name: "itemId", defaultValue: undefined, min: 1, max: 2147483647
    });

    const deleted = await CartItem.destroy({
        where: { id: itemId, user_id: req.userId }
    });

    if (deleted === 0) {
        throw new HttpError(404, "Cart item not found", "CART_ITEM_NOT_FOUND");
    }
    res.json({ ok: true });
}));


router.delete("/", requireAuth, asyncHandler(async (req, res) => {
    await CartItem.destroy({
        where: { user_id: req.userId }
    });

    res.json({ ok: true });
}));


export default router;
