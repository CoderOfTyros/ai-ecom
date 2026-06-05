import express from "express";
import { Product } from "../models/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../errors/HttpError.js";
import { readIntQuery } from "../utils/readIntQuery.js";


const router = express.Router();

const VALID_STATUSES = ["active", "draft", "archived"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PRODUCT_FIELDS = ["slug", "name", "description", "price_cents", "image_url", "category", "stock_quantity"];

function validateProductFields(body, { partial = false } = {}) {
    const fields = {};
    const {
        slug, name, description, price_cents, image_url,
        category, stock_quantity
    } = body ?? {};


    if (!partial || slug !== undefined) {
        if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
            fields.slug = "Slug must be a lowercase alphanumeric with hyphens (e.g. gaming-mouse)";
        }
    }

    if (!partial || name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
            fields.name = "Name is required";
        }
    }

    if (!partial || price_cents !== undefined) {
        if (!Number.isInteger(price_cents) || price_cents < 0) {
            fields.price_cents = "Must be a non-negative integer";
        }
    }

    if (stock_quantity !== undefined && stock_quantity !== null) {
        if (!Number.isInteger(stock_quantity) || stock_quantity < 0) {
            fields.stock_quantity = "Must be a non-negative integer";
        }
    }

    if (description !== undefined && description !== null && typeof description !== "string") {
        fields.description = "Must be a string or null";
    }

    if (image_url !== undefined && image_url !== null && typeof image_url !== "string") {
        fields.image_url = "Must be a string or null";
    }

    if (category !== undefined && (typeof category !== "string" || !category.trim())) {
        fields.category = "Must be a non-empty string";
    }

    if (Object.keys(fields).length) {
        throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", { fields });
    }

}


// ROUTES


router.post("/products", requireAuth, requireAdmin,
    asyncHandler(async (req, res) => {
        validateProductFields(req.body);

        const { slug, name, description, price_cents, stock_quantity, image_url, category } = req.body;

        let product;

        try {
            product = await Product.create({
                slug,
                name: name.trim(),
                description: description ?? null,
                price_cents,
                image_url: image_url ?? null,
                category: category?.trim() || "general",
                stock_quantity: stock_quantity ?? 0,
                status: "active"

            });
        } catch (err) {
            if (err.name === "SequelizeUniqueConstraintError") {
                throw new HttpError(409, "Slug already exists", "SLUG_TAKEN");
            }

            throw err;
        }

        res.status(201).json({ ok: true, product });
    })
);

router.patch("/products/:id", requireAuth, requireAdmin,
    asyncHandler(async (req, res) => {
        const id = readIntQuery(req.params.id, {
            name: "id", defaultValue: undefined, min: 1, max: 2147483647
        });


        validateProductFields(req.body, { partial: true });

        const product = await Product.findByPk(id);

        if (!product) {
            throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
        }

        for (const field of PRODUCT_FIELDS) {
            if (req.body[field] !== undefined) {
                product[field] = typeof req.body[field] === "string" ?
                    req.body[field].trim() : req.body[field];
            }
        }

        try {
            await product.save();
        } catch (err) {
            if (err.name === "SequelizeUniqueConstraintError") {
                throw new HttpError(409, "Slug already exists", "SLUG_TAKEN");
            }

            throw err;
        }
        res.json({ ok: true, product });
    })
);


router.patch("/products/:id/status", requireAuth, requireAdmin,
    asyncHandler(async (req, res) => {
        const id = readIntQuery(req.params.id, {
            name: "id", defaultValue: undefined, min: 1, max: 2147483647
        });

        const { status } = req.body ?? {};

        if (!VALID_STATUSES.includes(status)) {
            throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", {
                fields: { status: `Must be one of the following: ${VALID_STATUSES.join(", ")}` }
            });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
        }

        product.status = status;
        await product.save();

        res.json({ ok: true, product });
    })
);


export default router;




