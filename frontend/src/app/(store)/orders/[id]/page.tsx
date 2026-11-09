import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CircleCheck } from "lucide-react";

import { serverApi } from "@/lib/api/server-api";
import { ApiError } from "@/lib/api/ApiError";
import { formatPrice, formatShipping } from "@/lib/format";
import type { OrderResponse } from "@/types/order";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let data: OrderResponse;

    try {
        data = await serverApi<OrderResponse>(`/orders/${encodeURIComponent(id)}`, {
            cache: "no-store"
        });
    } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
            redirect(`/login?from=/orders/${encodeURIComponent(id)}`);
        }
        // 404: no such order for this user. 400: id is not a number (e.g. /orders/abc)
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
            notFound();
        }

        throw err;
    }

    const { order } = data;
    const address = order.shipping_address;
    const cancelled = order.status === "cancelled";

    return (
        <main className="mx-auto mt-35 mb-30 max-w-3xl px-6 font-nunito">
            <div className="mb-10 text-center">
                {!cancelled && <CircleCheck className="mx-auto size-14 text-emerald-700" />}

                <h1 className="mt-4 text-3xl font-semibold">Order #{order.id}</h1>

                <p className="mt-2 text-zinc-600">
                    {cancelled ? "This order has been cancelled." : "Thank you for your order!"}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
            </div>

            <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Items</h2>

                <ul>
                    {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between border-b border-zinc-200 py-4">
                            <div>
                                <Link
                                    href={`/products/${item.product_snapshot.slug}`}
                                    className="font-semibold hover:underline"
                                >
                                    {item.product_snapshot.name}
                                </Link>
                                <p className="text-sm text-zinc-500">
                                    {item.quantity} × {formatPrice(item.unit_price_cents)}
                                </p>
                            </div>
                            <span className="font-semibold">{formatPrice(item.line_total_cents)}</span>
                        </li>
                    ))}
                </ul>

                <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-zinc-500">Subtotal</dt>
                        <dd className="font-semibold">{formatPrice(order.subtotal_cents)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-zinc-500">Shipping</dt>
                        <dd className="font-semibold">{formatShipping(order.shipping_cents)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-zinc-200 pt-4">
                        <dt className="text-base font-bold">Total</dt>
                        <dd className="text-2xl font-bold text-emerald-900">{formatPrice(order.total_cents)}</dd>
                    </div>
                </dl>
            </section>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold">Delivery Address</h2>

                    {address ? (
                        <address className="space-y-1 not-italic text-zinc-700">
                            <p>{address.full_name}</p>
                            <p>{address.phone}</p>
                            <p>{address.line1}</p>
                            {address.line2 && <p>{address.line2}</p>}
                            <p>{[address.city, address.region].filter(Boolean).join(", ")}</p>
                            {address.postal_code && <p>{address.postal_code}</p>}
                            <p>{address.country}</p>
                        </address>
                    ) : (
                        <p className="text-zinc-500">No address saved for this order.</p>
                    )}
                </section>

                <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold">Payment</h2>
                    <p>Cash on Delivery</p>
                    <p className="mt-1 text-sm text-zinc-500">
                        {order.payment_status === "paid" ? "Paid" : "Pay when your order is delivered"}
                    </p>
                </section>
            </div>

            <div className="mt-10 flex justify-center gap-4">
                <Link
                    href="/orders"
                    className="rounded-lg border border-emerald-800 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
                >
                    My orders
                </Link>
                <Link
                    href="/products"
                    className="rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-900"
                >
                    Continue shopping
                </Link>
            </div>
        </main>
    );
}
