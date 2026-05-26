import { HttpError } from "../errors/HttpError.js";

export function readIntQuery(value, { name, defaultValue, min, max }) {
    if (value === undefined) return defaultValue;

    const num = Number(value);
    if (!Number.isInteger(num) || num < min || num > max) {
        throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", {
            fields: {
                [name]: `Must be an integer between ${min} and ${max}`
            }
        });
    }

    return num;
}