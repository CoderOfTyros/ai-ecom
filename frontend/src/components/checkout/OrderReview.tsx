import Image from "next/image";

import type { CartItem, CartSummary } from "@/types/cart";
import { formatPrice, formatShipping } from "@/lib/format";

interface OrderReviewProps {
    items: CartItem[];
    summary: CartSummary;
    pending: boolean;
}

export default function OrderReview({ items, summary, pending }: OrderReviewProps) {
    return (
        <aside className="sticky top-28 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Your Order</h2>

            <ul className="space-y-5">
                {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4">
                        <div className="relative size-16 shrink-0 rounded-lg bg-zinc-50">
                            {item.product.image_url && (
                                <Image
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    fill
                                    sizes="64px"
                                    className="rounded-lg object-contain"
                                />
                            )}
                        </div>

                        <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                        </div>

                        <span className="font-semibold">
                            {formatPrice(item.quantity * item.product.price_cents)}
                        </span>
                    </li>
                ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-zinc-200 pt-5 text-sm">
                <div className="flex justify-between">
                    <dt className="text-zinc-500">Subtotal</dt>
                    <dd className="font-semibold">{formatPrice(summary.subtotal_cents)}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-zinc-500">Shipping</dt>
                    <dd className="font-semibold">{formatShipping(summary.shipping_cents)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-zinc-200 pt-4">
                    <dt className="text-base font-bold">Total</dt>
                    <dd className="text-2xl font-bold text-emerald-900">{formatPrice(summary.total_cents)}</dd>
                </div>
            </dl>

            <div className="mt-6 rounded-lg bg-zinc-50 p-4">
                <p className="font-semibold">Cash on Delivery</p>
                <p className="mt-1 text-sm text-zinc-600">Pay when your order is delivered.</p>
            </div>

            {/* type="submit": this button sends the address form in CheckoutView */}
            <button
                type="submit"
                disabled={pending}
                className="mt-6 w-full cursor-pointer rounded-lg bg-emerald-800 p-3 font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {pending ? "Placing order..." : "Place Order"}
            </button>
        </aside>
    );
}
