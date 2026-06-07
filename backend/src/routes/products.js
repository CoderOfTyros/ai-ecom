import express from "express";
import { sequelize } from "../db.js";
import { readIntQuery } from "../utils/readIntQuery.js";
import { Product } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../errors/HttpError.js";
import { Op } from "sequelize";

const router = express.Router();

const SORT_OPTIONS = {
    newest: [["created_at", "DESC"], ["id", "DESC"]],
    oldest: [["created_at", "ASC"], ["id", "ASC"]],
    price_asc: [["price_cents", "ASC"], ["id", "ASC"]],
    price_desc: [["price_cents", "DESC"], ["id", "DESC"]]
};

router.get("/",
    asyncHandler(async (req, res) => {

        const page = readIntQuery(req.query.page, {
            name: "page", defaultValue: 1, min: 1, max: 100000
        });
        const limit = readIntQuery(req.query.limit, {
            name: "limit", defaultValue: 12, min: 1, max: 50
        });

        const offset = (page - 1) * limit;


        const where = { status: "active" };

        const { category, search, sort } = req.query;

        if (typeof category === "string" && category.trim()) {
            where.category = category.trim().toLowerCase();
        }


        if (typeof search === "string" && search.trim()) {
            const term = `%${search.trim()}%`;

            where[Op.or] = [
                { name: { [Op.iLike]: term } },
                { description: { [Op.iLike]: term } }
            ];
        }

        const minPrice = readIntQuery(req.query.min_price, {
            name: "min_price", defaultValue: undefined, min: 0, max: 2147483647
        });

        const maxPrice = readIntQuery(req.query.max_price, {
            name: "max_price", defaultValue: undefined, min: 0, max: 2147483647
        });

        if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
            throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", {
                fields: { min_price: "Cannot be greater than max_price" }
            });
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price_cents = {};
            if (minPrice !== undefined) where.price_cents[Op.gte] = minPrice;
            if (maxPrice !== undefined) where.price_cents[Op.lte] = maxPrice;
        }

        const order = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

        const { count, rows } = await Product.findAndCountAll({
            where,
            attributes: {
                exclude: ["description"]
            },
            order,
            limit,
            offset
        });

        res.json({
            ok: true,
            products: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });
    }));



router.get("/:id", asyncHandler(async (req, res) => {
    const id = readIntQuery(req.params.id, {
        name: "id", defaultValue: undefined, min: 1, max: 2147483647
    })

    const product = await Product.findOne({
        where: { id, status: "active" }
    });

    if (!product) {
        throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    res.json({
        ok: true,
        product
    });

}));

export default router;
