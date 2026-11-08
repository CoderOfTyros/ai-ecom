import express from "express";
import { CartItem, Product } from "../models/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../errors/HttpError.js";
import { validate } from "../validation/validate.js";
import { itemIdParam, addCartItemBody, updateCartItemBody, CART_MAX_QUANTITY } from "../validation/schemas.js";
import { calcShippingCents } from "../utils/shipping.js";

const router = express.Router();

const CART_PRODUCT_FIELDS = ["id", "slug", "name", "price_cents", "image_url", "category", "status", "stock_quantity"];

function summarize(items) {
    let totalItems = 0;
    let subtotalCents = 0;

    for (const item of items) {
        const plainItem = item.toJSON(); // converts sequelize object into plain js object
        totalItems += plainItem.quantity;
        subtotalCents += plainItem.quantity * plainItem.product.price_cents;
    }

    const shippingCents = calcShippingCents(subtotalCents);

    return {
        total_items: totalItems,
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        total_cents: subtotalCents + shippingCents
    };
}

async function getTotalItems(userId) {
    const items = await CartItem.findAll({
        where: { user_id: userId },
        attributes: ["quantity"],
    });

    return items.reduce((total, item) => total + item.quantity, 0);
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
    const { product_id: productId, quantity } = validate(addCartItemBody, req.body);

    const product = await findActiveProduct(productId);

    const existingItem = await CartItem.findOne({
        where: { user_id: req.userId, product_id: productId }
    });


    if (existingItem) {
        const newQuantity = quantity + existingItem.quantity;

        if (newQuantity > CART_MAX_QUANTITY) {
            throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", {
                fields: {
                    quantity: `Cart item quantity cannot exceed ${CART_MAX_QUANTITY}`,
                },
            });
        }

        assertStock(product, newQuantity);

        existingItem.quantity = newQuantity;
        await existingItem.save();

        const item = await fetchItemWithProduct(existingItem.id, req.userId);
        const totalItems = await getTotalItems(req.userId);

        return res.status(200).json({ ok: true, item, total_items: totalItems });
    }
    assertStock(product, quantity);
    const created = await CartItem.create({
        user_id: req.userId,
        product_id: productId,
        quantity
    });

    const item = await fetchItemWithProduct(created.id, req.userId);
    const totalItems = await getTotalItems(req.userId);

    res.status(201).json({ ok: true, item, total_items: totalItems });

}));


router.patch("/items/:itemId", requireAuth, asyncHandler(async (req, res) => {
    const { itemId } = validate(itemIdParam, req.params);
    const { quantity } = validate(updateCartItemBody, req.body);

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

    const totalItems = await getTotalItems(req.userId);

    res.json({ ok: true, item, total_items: totalItems });
}));

router.delete("/items/:itemId", requireAuth, asyncHandler(async (req, res) => {
    const { itemId } = validate(itemIdParam, req.params);

    const deleted = await CartItem.destroy({
        where: { id: itemId, user_id: req.userId }
    });

    if (deleted === 0) {
        throw new HttpError(404, "Cart item not found", "CART_ITEM_NOT_FOUND");
    }

    const totalItems = await getTotalItems(req.userId);

    res.json({ ok: true, total_items: totalItems });
}));


router.delete("/", requireAuth, asyncHandler(async (req, res) => {
    await CartItem.destroy({
        where: { user_id: req.userId }
    });

    res.json({ ok: true, total_items: 0 });
}));


export default router;
