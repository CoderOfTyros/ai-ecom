import express from "express";
import { sequelize } from "../db.js";
import { Order, OrderItem, Product, User } from "../models/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { HttpError } from "../errors/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { readIntQuery } from "../utils/readIntQuery.js";


const router = express.Router();


const VALID_STATUSES = ["confirmed", "cancelled"];

const ORDER_ITEM_FIELDS = [
    "id", "product_id", "product_snapshot", "quantity",
    "unit_price_cents", "line_total_cents", "created_at"
];

router.use(requireAuth, requireAdmin);


router.get("/orders", asyncHandler(async (req, res) => {
    const page = readIntQuery(req.query.page, {
        name: "page", defaultValue: 1, min: 1, max: 99999
    });

    const limit = readIntQuery(req.query.limit, {
        name: "limit", defaultValue: 20, min: 1, max: 50
    });

    const offset = (page - 1) * limit;

    const where = {};

    //filter by status
    const { status } = req.query;

    if (typeof status === "string" && VALID_STATUSES.includes(status)) {
        where.status = status;
    }

    //filter by user id 
    const userId = readIntQuery(req.query.user_id, {
        name: "user_id", defaultValue: undefined, min: 1, max: 2147483647
    });

    if (userId !== undefined) {
        where.user_id = userId;
    }

    const { count, rows } = await Order.findAndCountAll({
        where,
        include: {
            model: User,
            as: "user",
            attributes: ["id", "email"]
        },
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


router.get("/orders/:id", asyncHandler(async (req, res) => {
    const id = readIntQuery(req.params.id, {
        name: "id", defaultValue: undefined, min: 1, max: 2147483647
    });

    const order = await Order.findByPk(id, {
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "email"]
            },
            {
                model: OrderItem,
                as: "items",
                attributes: ORDER_ITEM_FIELDS
            }
        ]
    });

    if (!order) {
        throw new HttpError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    res.json({ ok: true, order });
})
);


router.patch("/orders/:id/status", asyncHandler(async (req, res) => {
    const id = readIntQuery(req.params.id, {
        name: "id", defaultValue: undefined, min: 1, max: 2147483647
    });

    const { status } = req.body ?? {};

    if (!VALID_STATUSES.includes(status)) {
        throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", {
            fields: {
                status: `Must be one of: ${VALID_STATUSES.join(", ")}`
            }
        });
    }

    const updatedOrder = await sequelize.transaction(async (t) => {
        const order = await Order.findByPk(id, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!order) {
            throw new HttpError(404, "Order not found", "ORDER_NOT_FOUND");
        }

        if (order.status === status) {
            throw new HttpError(400, `Order is already ${status}`, "INVALID_STATUS_TRANSITION");
        }

        if (order.status === "cancelled") {
            throw new HttpError(400, "Cancelled orders cannot be modified", "INVALID_STATUS_TRANSITION");
        }


        if (status === "cancelled") {
            const items = await OrderItem.findAll({
                where: { order_id: order.id },
                transaction: t
            });

            for (const item of items) {
                const product = await Product.findByPk(item.product_id, {
                    transaction: t,
                    lock: t.LOCK.UPDATE
                });

                if (product) {
                    product.stock_quantity += item.quantity;
                    await product.save({ transaction: t });
                }
            }
        }

        order.status = status;
        await order.save({ transaction: t });

        return order;
    });

    const fullOrder = await Order.findByPk(updatedOrder.id, {
        include: [
            { model: User, as: "user", attributes: ["id", "email"] },
            { model: OrderItem, as: "items", attributes: ORDER_ITEM_FIELDS }
        ]
    });

    res.json({ ok: true, order: fullOrder });
})
);

export default router;