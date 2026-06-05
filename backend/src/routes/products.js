import express from "express";
import { sequelize } from "../db.js";
import { readIntQuery } from "../utils/readIntQuery.js";
import { Product } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../errors/HttpError.js";

const router = express.Router();


router.get("/",
    asyncHandler(async (req, res) => {

        const page = readIntQuery(req.query.page, {
            name: "page", defaultValue: 1, min: 1, max: 100000
        });
        const limit = readIntQuery(req.query.limit, {
            name: "limit", defaultValue: 12, min: 1, max: 50
        });

        const offset = (page - 1) * limit;

        const { count, rows } = await Product.findAndCountAll({
            where: { status: "active" },
            attributes: {
                exclude: ["description"]
            },
            order: [
                ["created_at", "DESC"],
                ["id", "DESC"]],
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
    const id = readIntQuery(req.query.id, {
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
