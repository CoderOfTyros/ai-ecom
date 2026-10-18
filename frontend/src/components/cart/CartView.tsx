"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import type {
    CartItem as CartItemType,
    CartItemMutationResponse,
    DeleteCartItemResponse,
    CartSummary
} from "@/types/cart";

import { api } from "@/lib/api/api";
import { ApiError } from "@/lib/api/ApiError";
import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";
import { CartSummaryCard } from "./CartSummary";


interface CartViewProps {
    initialItems: CartItemType[];
    initialSummary: CartSummary;

}
interface CartState {
    items: CartItemType[];
    summary: CartSummary;
}

function calculateSubtotal(items: CartItemType[]) {
    return items.reduce((total, item) =>
        total + item.quantity * item.product.price_cents
        , 0);
}

export default function CartView({ initialItems, initialSummary }: CartViewProps) {
    const { setCartCount } = useCart();

    const [cart, setCart] = useState<CartState>({
        items: initialItems,
        summary: initialSummary
    });

    const [pendingItemId, setPendingItemId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isUpdating = pendingItemId !== null;

    useEffect(() => {
        setCartCount(initialSummary.total_items);
    }, [initialSummary.total_items, setCartCount]);

    async function handleQuantityChange(itemId: number, quantity: number) {
        if (isUpdating) return;

        try {
            setPendingItemId(itemId);
            setError(null);

            const data = await api<CartItemMutationResponse>(`/cart/items/${itemId}`, {
                method: "PATCH",
                body: JSON.stringify({ quantity })
            });

            setCart((currentCart) => {
                const updatedItems = currentCart.items.map((item) =>
                    item.id === data.item.id ? data.item : item
                );

                return {
                    items: updatedItems,
                    summary: {
                        total_items: data.total_items,
                        subtotal_cents: calculateSubtotal(updatedItems)
                    }
                }
            });

            setCartCount(data.total_items);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Failed to update cart");
            }
        } finally {
            setPendingItemId(null);
        }
    }


    async function handleRemove(itemId: number) {
        if (isUpdating) return;

        try {
            setPendingItemId(itemId);
            setError(null);

            const data = await api<DeleteCartItemResponse>(
                `/cart/items/${itemId}`, {
                method: "DELETE"
            });

            setCart((currentCart) => {
                const updatedItems = currentCart.items.filter((item) =>
                    item.id !== itemId
                );
                return {
                    items: updatedItems,
                    summary: {
                        total_items: data.total_items,
                        subtotal_cents: calculateSubtotal(updatedItems)
                    }
                }
            });

            setCartCount(data.total_items);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Failed to remove item");
            }
        }
        finally {
            setPendingItemId(null);
        }
    }

    if (cart.items.length === 0) {
        return (
            <main className="mx-auto mt-32 max-w-5xl px-6 text-center">
                <h1 className="text-3xl font-bold">Your cart is empty</h1>

                <p className="mt-3 text-gray-500">
                    Add some products to your cart to get started.
                </p>

                <Link
                    href="/products"
                    className="mt-6 inline-block rounded-full bg-emerald-900 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                >
                    Browse products
                </Link>
            </main>
        );
    }

    return (
        <main className="mt-35 px-10 mb-30">
            <h1 className="mt-10 text-center text-3xl font-semibold font-nunito">Your Shopping Cart</h1>
            <div className="flex">
                <section className="max-w-4xl mt-15">

                    {error && (
                        <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="w-full">
                        {cart.items.map((item) =>
                            <CartItem
                                key={item.id}
                                item={item}
                                disabled={isUpdating}
                                pending={item.id === pendingItemId}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}

                            />
                        )}
                    </div>
                </section>

                <CartSummaryCard summary={cart.summary} />
            </div>
        </main>
    );
}