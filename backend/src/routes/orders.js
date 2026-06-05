import express from "express";
import { CartItem, Product, Order, OrderItem } from "../models/index.js";
import { sequelize } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../errors/HttpError.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { readIntQuery } from "../utils/readIntQuery.js";


const router = express.Router();

const ORDER_ITEM_FIELDS = ["id", "product_id", "product_snapshot", "quantity",
    "unit_price_cents", "line_total_cents", "created_at"];


router.post("/", requireAuth, asyncHandler(async (req, res) => {

    const result = await sequelize.transaction(async (t) => {
        const cartItems = await CartItem.findAll({
            where: { user_id: req.userId },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (cartItems.length === 0) {
            throw new HttpError(400, "Cart is empty", "CART_EMPTY");
        }

        let subtotalCents = 0;
        const orderItemsData = [];

        for (const cartItem of cartItems) {
            const product = await Product.findOne({
                where: { id: cartItem.product_id, status: "active" },
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!product) {
                throw new HttpError(404, "Product unavailable", "PRODUCT_NOT_FOUND", {
                    fields: { product_id: cartItem.product_id }
                });
            }

            if (cartItem.quantity > product.stock_quantity) {
                throw new HttpError(409, "Not enough stock", "INSUFFICIENT_STOCK", {
                    fields: {
                        product_id: product.id,
                        available: product.stock_quantity,
                        requested: cartItem.quantity
                    }
                });
            }

            const lineTotalCents = cartItem.quantity * product.price_cents;
            subtotalCents += lineTotalCents;

            orderItemsData.push({
                product,
                quantity: cartItem.quantity,
                lineTotalCents
            });
        }

        const order = await Order.create(
            { user_id: req.userId, subtotal_cents: subtotalCents },
            { transaction: t }
        );


        for (const { product, quantity, lineTotalCents } of orderItemsData) {
            await OrderItem.create({
                order_id: order.id,
                product_id: product.id,
                product_snapshot: {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    image_url: product.image_url,
                    category: product.category
                },
                quantity,
                unit_price_cents: product.price_cents,
                line_total_cents: lineTotalCents

            },
                { transaction: t }
            );

            product.stock_quantity -= quantity;
            await product.save({ transaction: t });
        }


        await CartItem.destroy({
            where: { user_id: req.userId },
            transaction: t
        });

        return order;
    });

    const fullOrder = await Order.findOne({
        where: { id: result.id, user_id: req.userId },
        include: [{
            model: OrderItem,
            as: "items",
            attributes: ORDER_ITEM_FIELDS
        }]
    });

    res.status(201).json({ ok: true, order: fullOrder });

}));



router.get("/", requireAuth, asyncHandler(async (req, res) => {
    const page = readIntQuery(req.query.page, {
        name: "page", defaultValue: 1, min: 1, max: 10000
    });

    const limit = readIntQuery(req.query.limit, {
        name: "limit", defaultValue: 10, min: 1, max: 50
    });

    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
        where: { user_id: req.userId },
        order: [["created_at", "DESC"], ["id", "DESC"]],
        limit,
        offset
    });

    res.json({
        ok: true,
        orders: rows,
        pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit)
        }
    });

})
);


router.get("/:id", requireAuth, asyncHandler(async (req, res) => {
    const id = readIntQuery(req.params.id, {
        name: "id", defaultValue: undefined, min: 1, max: 2147483647
    });

    const order = await Order.findOne({
        where: { id, user_id: req.userId },
        include: [{
            model: OrderItem,
            as: "items",
            attributes: ORDER_ITEM_FIELDS
        }]
    });

    if (!order) {
        throw new HttpError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    res.json({ ok: true, order });

})
);


export default router;