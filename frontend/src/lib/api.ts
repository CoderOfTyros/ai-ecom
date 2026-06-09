const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
    status: number;
    code: string;
    fields?: Record<string, string>;

    constructor(status: number, message: string, code: string, fields?: Record<string, string>) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.fields = fields;
    }
}


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
        throw new ApiError(
            res.status,
            data.error ?? "Request failed",
            data.code ?? "UNKNOWN",
            data.details?.fields
        );
    }

    return data as T;
}