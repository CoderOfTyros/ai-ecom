"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { api } from "@/lib/api/api";
import { useAuth } from "@/context/AuthContext";
import type { CartResponse } from "@/types/cart";

interface CartContextValue {
    cartCount: number;
    setCartCount: (count: number) => void;
    refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    const userId = user?.id ?? null;

    const [cartState, setCartState] = useState<{
        userId: number | null;
        count: number;
    }>({
        userId: null,
        count: 0,
    });

    const cartCount =
        userId !== null && cartState.userId === userId
            ? cartState.count
            : 0;

    const setCartCount = useCallback(
        (count: number) => {
            if (userId === null) return;

            setCartState({
                userId,
                count,
            });
        },
        [userId],
    );

    const refreshCartCount = useCallback(async () => {
        if (userId === null) return;

        try {
            const data = await api<CartResponse>("/cart");

            setCartState({
                userId,
                count: data.summary.total_items,
            });
        } catch (error) {
            console.error("Failed to load cart count:", error);
        }
    }, [userId]);

    useEffect(() => {
        if (loading || userId === null) return;

        async function loadCartCount() {
            await refreshCartCount();
        }
        loadCartCount();
    }, [loading, userId, refreshCartCount]);

    return (
        <CartContext.Provider
            value={{
                cartCount,
                setCartCount,
                refreshCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider",
        );
    }

    return context;
}