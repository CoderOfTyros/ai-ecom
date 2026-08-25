import { ApiError } from "./ApiError";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


export async function api<T = Record<string, unknown>>(
    path: string,
    options: RequestInit = {}
): Promise<T> {

    const { headers, body, ...rest } = options;

    const res = await fetch(`${API}${path}`, {
        credentials: "include",
        cache: "no-store",
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...headers
        },
        ...(body ? { body } : {}),
        ...rest
    });

    const data = await res.json();

    if (!data.ok) {
        if (res.status === 401) {
            // To handle jwt token expiry
            window.dispatchEvent(new Event("auth:unauthorized"));
        }
        throw new ApiError(
            res.status,
            data.error ?? "Request failed",
            data.code ?? "UNKNOWN",
            data.details?.fields
        );
    }

    return data as T;
}