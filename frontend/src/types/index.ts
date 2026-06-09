export interface User {
    id: number;
    email: string;
    is_admin: boolean;
}

export interface ApiErrorResponse {
    ok: false;
    error: string;
    code: string;
    details?: {
        fields?: Record<string, string>
    };
}