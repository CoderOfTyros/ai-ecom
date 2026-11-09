import { redirect } from "next/navigation";

import { serverApi } from "@/lib/api/server-api";
import { ApiError } from "@/lib/api/ApiError";
import type { CartResponse } from "@/types/cart";
import CheckoutView from "@/components/checkout/CheckoutView";

export default async function CheckoutPage() {
    let data: CartResponse;

    try {
        data = await serverApi<CartResponse>("/cart", {
            cache: "no-store"
        });
    } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
            redirect("/login?from=/checkout");
        }

        throw err;
    }

    // nothing to check out
    if (data.items.length === 0) {
        redirect("/cart");
    }

    return <CheckoutView items={data.items} summary={data.summary} />;
}
