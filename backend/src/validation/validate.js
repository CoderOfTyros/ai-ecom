import { HttpError } from "../errors/HttpError.js";

// Checks `input` with a zod schema.
// Good data: returns the clean data.
// Bad data: throws 400 with details.fields = { fieldName: "message" }.
export function validate(schema, input) {
    const result = schema.safeParse(input ?? {});

    if (result.success) {
        return result.data;
    }

    const fields = {};
    for (const issue of result.error.issues) {
        fields[issue.path.join(".")] = issue.message;
    }

    throw new HttpError(400, "Validation failed", "VALIDATION_ERROR", { fields });
}
