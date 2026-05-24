import { HttpError } from "../errors/HttpError.js";

export function notFound(req, res, next) {
    next(new HttpError(404,
        `Route not found: ${req.method} ${req.originalUrl}`,
        "NOT_FOUND"));
}