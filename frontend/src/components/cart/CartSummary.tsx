import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import type { CartSummary } from "@/types/cart";
import { formatPrice, formatShipping } from "@/lib/format";


export function CartSummaryCard({ summary }: { summary: CartSummary }) {
    const itemLabel = summary.total_items === 1 ? "item" : "items";
    // the free-shipping limit comes from the backend, so it is never out of date
    const amountForFreeShipping = Math.max(0, summary.free_shipping_min_cents - summary.subtotal_cents);

    return (
        <aside className="w-full">
            <div className="sticky top-28 mx-auto mt-15 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm font-nunito">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <dl className="mt-6 flex flex-col gap-y-3 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-zinc-500">Subtotal ({summary.total_items} {itemLabel})</dt>
                        <dd className="font-semibold text-zinc-800">{formatPrice(summary.subtotal_cents)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-zinc-500">Shipping</dt>
                        <dd className="font-semibold text-zinc-800">{formatShipping(summary.shipping_cents)}</dd>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between border-t border-zinc-200 pt-4">
                        <dt className="text-base font-bold">Total</dt>
                        <dd className="text-2xl font-bold text-emerald-900">{formatPrice(summary.total_cents)}</dd>
                    </div>
                </dl>

                {amountForFreeShipping > 0 && (
                    <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-xs text-emerald-900">
                        Add {formatPrice(amountForFreeShipping)} more for free shipping
                    </p>
                )}

                <Link
                    href="/checkout"
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-900"
                >
                    Checkout
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                    href="/products"
                    className="mt-4 block text-center text-sm font-semibold text-emerald-800 hover:text-emerald-900 hover:underline"
                >
                    Continue shopping
                </Link>

                <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                    <Lock className="size-3.5" />
                    Secure checkout
                </p>
            </div>
        </aside>
    );
}
