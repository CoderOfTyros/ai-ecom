"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AddressForm from "./AddressForm";
import OrderReview from "./OrderReview";

import { api } from "@/lib/api/api";
import { ApiError } from "@/lib/api/ApiError";
import { useCart } from "@/context/CartContext";

import type { CartItem, CartSummary } from "@/types/cart";
import type { ShippingAddress, OrderResponse } from "@/types/order";

interface CheckoutViewProps {
    items: CartItem[];
    summary: CartSummary;
}

const EMPTY_ADDRESS: ShippingAddress = {
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postal_code: "",
    country: "Lebanon"
};

export default function CheckoutView({ items, summary }: CheckoutViewProps) {
    const router = useRouter();
    const { setCartCount } = useCart();

    const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [cartProblem, setCartProblem] = useState(false);

    function handleChange(field: keyof ShippingAddress, value: string) {
        setAddress((current) => ({ ...current, [field]: value }));

        // hide the old error for this field while the user types
        setFieldErrors((current) => {
            const updated = { ...current };
            delete updated[field];
            return updated;
        });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (pending) return;

        setPending(true);
        setError("");
        setFieldErrors({});
        setCartProblem(false);

        try {
            const data = await api<OrderResponse>("/orders", {
                method: "POST",
                body: JSON.stringify({ shipping_address: address })
            });

            // Success: keep the button off and go to the order page
            setCartCount(0);
            router.replace(`/orders/${data.order.id}`);
            return;
        } catch (err) {
            if (!(err instanceof ApiError)) {
                setError("Could not confirm your order. Check your orders before you try again.");
            } else if (err.code === "VALIDATION_ERROR") {
                setFieldErrors(err.fields ?? {});
                setError("Please fix the fields marked in red.");
            } else if (err.code === "INSUFFICIENT_STOCK" || err.code === "PRODUCT_NOT_FOUND") {
                setCartProblem(true);
                setError("Some products in your cart are no longer available in the quantity you chose.");
            } else if (err.code === "CART_EMPTY") {
                router.replace("/cart");
                return;
            } else if (err.status === 401) {
                router.replace("/login?from=/checkout");
                return;
            } else {
                setError("Could not place your order. Please try again.");
            }
        }

        // only reached after an error: turn the button on again
        setPending(false);
    }

    return (
        <main className="mx-auto mt-35 mb-30 max-w-7xl px-6 font-nunito">
            <h1 className="mb-10 text-center text-3xl font-semibold">Checkout</h1>

            {error && (
                <div role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                    <p>{error}</p>
                    {cartProblem && (
                        <Link href="/cart" className="mt-2 inline-block font-semibold underline">
                            Back to cart
                        </Link>
                    )}
                </div>
            )}

            {/* One form: the inputs and the Place Order button are inside it,
                so "required" works and Enter submits */}
            <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <AddressForm
                        values={address}
                        fieldErrors={fieldErrors}
                        disabled={pending}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <OrderReview items={items} summary={summary} pending={pending} />
                </div>
            </form>
        </main>
    );
}
