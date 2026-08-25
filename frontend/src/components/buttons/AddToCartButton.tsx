"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import type { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { api } from "@/lib/api/api";
import { ApiError } from "@/lib/api/ApiError";

const SUCCESS_MESSAGE_DURATION_MS = 2500;

interface AddToCartButtonProps {
    product: Product;
    quantity?: number;
    disabled?: boolean;
    className?: string
}

export function AddToCartButton({
    product,
    quantity = 1,
    disabled = false,
    className
}: AddToCartButtonProps) {
    const router = useRouter();

    const [isAdding, setIsAdding] = useState(false)
    const [isRefreshing, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    const inFlight = useRef(false); // variable that survives react rerenders

    const isOutOfStock = product.stock_quantity <= 0;
    const isBusy = isAdding || isRefreshing;
    const isDisabled = isBusy || isOutOfStock || disabled;

    useEffect(() => {
        if (!successMessage) return;

        const timerId = window.setTimeout(() => {
            setSuccessMessage(null);
        }, SUCCESS_MESSAGE_DURATION_MS);

        return () => {
            window.clearTimeout(timerId);
        };

    }, [successMessage])


    function getButtonLabel() {
        if (isBusy) return "Adding...";
        if (isOutOfStock) return "Out of stock";

        return "Add to cart";
    }

    async function handleClick(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (inFlight.current || isDisabled) return;

        inFlight.current = true;
        setError(null);
        setSuccessMessage(null);
        setIsAdding(true);

        try {
            await api(`/cart/items`, {
                method: "POST",
                body: JSON.stringify({ product_id: product.id, quantity }),
            });

            setSuccessMessage("Added to cart");

            // router.refresh re-runs server components (e.g. a cart badge).
            // Drop this if your cart count lives in client context instead.
            startTransition(() => router.refresh());
        }

        catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                const returnTo = encodeURIComponent(`/products/${product.slug}`);
                router.push(`/login?from=${returnTo}`);
                return;
            }

            setError(err instanceof ApiError ? err.message : "Could not add to cart");

        } finally {
            setIsAdding(false);
            inFlight.current = false;
        }

    }


    const buttonLabel = getButtonLabel();

    return (<div className={className}>
        <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            aria-busy={isBusy}
            className="flex w-full h-full text-sm justify-center items-center  bg-emerald-800 text-white rounded-full px-6 gap-2 py-2 cursor-pointer transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-gray-800"
        >
            <ShoppingCart aria-hidden={true} className="h-5 w-5" />
            {buttonLabel}
        </button>

        {successMessage && (
            <p role="status" className="text-xs text-emerald-700">
                {successMessage}
            </p>
        )}

        {error && (<p role="alert" className="text-red-600">
            {error}
        </p>)
        }
    </div>
    );
}