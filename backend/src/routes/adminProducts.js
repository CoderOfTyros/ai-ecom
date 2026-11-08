import express from "express";
import { Product } from "../models/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../errors/HttpError.js";
import { validate } from "../validation/validate.js";
import { idParam, createProductBody, updateProductBody, productStatusBody } from "../validation/schemas.js";


const router = express.Router();


// ROUTES


router.post("/products", requireAuth, requireAdmin,
    asyncHandler(async (req, res) => {
        const { slug, name, description, price_cents, stock_quantity, image_url, category } =
            validate(createProductBody, req.body);

        let product;

        try {
            product = await Product.create({
                slug,
                name,
                description: description ?? null,
                price_cents,
                image_url: image_url ?? null,
                category: category || "general",
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
        const { id } = validate(idParam, req.params);
        const changes = validate(updateProductBody, req.body);

        const product = await Product.findByPk(id);

        if (!product) {
            throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
        }

        // zod already trimmed strings and removed unknown keys
        for (const [field, value] of Object.entries(changes)) {
            if (value !== undefined) {
                product[field] = value;
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
        const { id } = validate(idParam, req.params);
        const { status } = validate(productStatusBody, req.body);

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




