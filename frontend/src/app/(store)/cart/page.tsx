import { serverApi } from "@/lib/api/server-api";
import type { CartResponse } from "@/types/cart";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/ApiError";

import CartView from "@/components/cart/CartView";


export default async function CartPage() {
    let data: CartResponse;
    try {
        data = await serverApi<CartResponse>("/cart", {
            cache: "no-store"
        });


    } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
            redirect("/login");
        }

        throw err;
    }

    return (
        <CartView initialItems={data.items} initialSummary={data.summary} />
    );
}