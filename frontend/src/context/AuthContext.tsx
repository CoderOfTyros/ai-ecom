"use client";

import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from "react";
import { api } from "@/lib/api/api";
import type { User } from "@/types";


interface AuthState {
    user: User | null;
    loading: boolean,
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthState>({
    user: null,
    loading: true,
    refresh: async () => { },
    logout: async () => { }
});


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    const refresh = useCallback(async () => {

        try {
            const data = await api<{ ok: true, user: User }>("/auth/me");
            setUser(data.user);
        } catch {
            setUser(null);
        }

        finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api("/auth/logout", { method: "POST" });
        }
        catch { }

        setUser(null);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);


    useEffect(() => {
        function handleUnauthorized() {
            setUser(null);
        }

        window.addEventListener("auth:unauthorized", handleUnauthorized);

        return () => {
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
        };

    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}

