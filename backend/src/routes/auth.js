import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sequelize } from "../db.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../errors/HttpError.js";

const router = express.Router();
const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token"

function getCookieOptions() {
    const isProd = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
}

function setAuthCookie(res, token) {
    res.cookie(COOKIE_NAME, token, getCookieOptions());
}

function clearAuthCookie(res) {
    const { maxAge, ...opts } = getCookieOptions();
    res.clearCookie(COOKIE_NAME, opts);
}

function signAuthToken(userId) {
    return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}



//ROUTES

router.post("/register", asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    const validationErrors = {};
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
        validationErrors.email = "Valid email required";
    }

    if (typeof password !== "string" || password.length < 8) {
        validationErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(validationErrors).length) {
        throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", { validationErrors });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    try {
        user = await User.create({
            email: normalizedEmail,
            password_hash: passwordHash
        });

    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            throw new HttpError(409, "Email already registered", "EMAIL_TAKEN");
            //POSTGRES database error
        }

        throw err;
    }

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    res.status(201).json({
        ok: true,
        user: {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin
        }
    });

}));


router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    const validationErrors = {};
    if (!normalizedEmail) validationErrors.email = "Email required";
    if (typeof password !== "string" || !password) validationErrors.password = "Password required";
    if (Object.keys(validationErrors).length) {
        throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", { validationErrors });
    }

    const user = await User.scope("withPassword").findOne({
        where: { email: normalizedEmail }
    });

    if (!user) {
        throw new HttpError(401, "Invalid credentials", "INVALID_CREDENTIALS")
    }
    const passwordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!passwordCorrect) {
        throw new HttpError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    res.json({
        ok: true,
        user: {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin
        }
    });
}));


router.post("/logout", asyncHandler(async (req, res) => {
    clearAuthCookie(res);
    res.json({
        ok: true
    });
}));


router.get("/me", requireAuth, asyncHandler(async (req, res) => {

    const user = await User.findByPk(req.userId);

    if (!user) {
        throw new HttpError(404, "User not found", "USER_NOT_FOUND");
    }

    res.json({
        ok: true,
        user: {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin
        }
    });
}))


export default router;