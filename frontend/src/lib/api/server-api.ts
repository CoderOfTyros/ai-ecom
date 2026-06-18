import { cookies } from "next/headers";
import { ApiError } from "./ApiError";

// add auth flag later to prevent cookie fowarding at every request

const API = process.env.API_URL || "http://localhost:4000";

export async function serverApi<T = Record<string, unknown>>(
    path: string, options: RequestInit = {}
): Promise<T> {
    const { headers, body, ...rest } = options;

    const cookieHeader = (await cookies()).toString();

    const res = await fetch(`${API}${path}`, {
        cache: "no-store",
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...(cookieHeader ? { cookie: cookieHeader } : {}),
            ...headers
        },
        ...(body ? { body } : {}),
        ...rest
    });

    const data = await res.json();

    if (!data.ok) {
        throw new ApiError(
            res.status,
            data.error ?? "Request failed",
            data.code ?? "UNKNOWN",
            data.details?.fields
        )
    }

    return data as T;
}