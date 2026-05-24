import jwt from "jsonwebtoken";
import { OK } from "zod";
import { HttpError } from "../errors/HttpError.js";

export function requireAuth(req, res, next) {
    const cookieName = process.env.COOKIE_NAME || "auth_token";
    const token = req.cookies?.[cookieName];

    if (!token) {
        throw new HttpError(401, "Not authenticated", "NOT_AUTHENTICATED");
    }

    let payload;

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    }

    catch {
        throw new HttpError(401, "Invalid token", "INVALID_TOKEN");
    }

    const userId = Number(payload?.sub);
    if (!Number.isFinite(userId)) {
        throw new HttpError(401, "Invalid token", "INVALID_TOKEN");
    }

    req.userId = userId;
    next();
}