import express from "express";
import { sequelize } from "../db.js";
import { validate } from "../validation/validate.js";
import { productListQuery } from "../validation/schemas.js";
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

        const {
            page, limit, category, search, sort,
            min_price: minPrice, max_price: maxPrice
        } = validate(productListQuery, req.query);

        const offset = (page - 1) * limit;


        const where = { status: "active" };

        if (category) {
            where.category = category;
        }


        if (search) {
            const term = `%${search}%`;

            where[Op.or] = [
                { name: { [Op.iLike]: term } },
                { description: { [Op.iLike]: term } }
            ];
        }

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

        const order = SORT_OPTIONS[sort];

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



router.get("/:slug", asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    const product = await Product.findOne({
        where: { slug, status: "active" }
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
