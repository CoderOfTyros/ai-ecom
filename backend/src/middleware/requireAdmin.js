import { User } from "../models/index.js";
import { HttpError } from "../errors/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const requireAdmin = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.userId, {
        attributes: ["id", "is_admin"]
    });

    if (!user || !user.is_admin) {
        throw new HttpError(403, "Admin access required", "ADMIN_REQUIRED");
    }

    next();
});