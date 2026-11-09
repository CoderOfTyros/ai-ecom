import Link from "next/link";
import { redirect } from "next/navigation";

import { serverApi } from "@/lib/api/server-api";
import { ApiError } from "@/lib/api/ApiError";
import { Pagination } from "@/components/Pagination";
import { formatPrice } from "@/lib/format";
import type { OrdersListResponse } from "@/types/order";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page: pageParam } = await searchParams;
    const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

    let data: OrdersListResponse;

    try {
        data = await serverApi<OrdersListResponse>(`/orders?page=${page}`, {
            cache: "no-store"
        });
    } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
            redirect("/login?from=/orders");
        }

        throw err;
    }

    return (
        <main className="mx-auto mt-35 mb-30 max-w-3xl px-6 font-nunito">
            <h1 className="mb-10 text-center text-3xl font-semibold">My Orders</h1>

            {data.orders.length === 0 ? (
                <div className="text-center">
                    <p className="text-zinc-500">You have no orders yet.</p>
                    <Link
                        href="/products"
                        className="mt-6 inline-block rounded-full bg-emerald-900 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                    >
                        Browse products
                    </Link>
                </div>
            ) : (
                <ul className="space-y-4">
                    {data.orders.map((order) => (
                        <li key={order.id}>
                            <Link
                                href={`/orders/${order.id}`}
                                className="flex justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-700"
                            >
                                <div>
                                    <h2 className="font-bold">Order #{order.id}</h2>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    <p
                                        className={`mt-2 text-sm font-semibold capitalize ${
                                            order.status === "cancelled" ? "text-red-600" : "text-emerald-800"
                                        }`}
                                    >
                                        {order.status}
                                    </p>
                                </div>
                                <span className="font-bold">{formatPrice(order.total_cents)}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {data.pagination.totalPages > 1 && (
                <div className="mt-10">
                    <Pagination pagination={data.pagination} />
                </div>
            )}
        </main>
    );
}
