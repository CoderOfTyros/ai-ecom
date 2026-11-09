import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Package, UserRound } from "lucide-react";

import { serverApi } from "@/lib/api/server-api";
import { ApiError } from "@/lib/api/ApiError";
import type { User } from "@/types";

export const metadata: Metadata = {
    title: "My Account"
};

export default async function AccountPage() {
    let user: User;

    try {
        const data = await serverApi<{ ok: true; user: User }>("/auth/me", {
            cache: "no-store"
        });
        user = data.user;
    } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
            redirect("/login?from=/account");
        }

        throw err;
    }

    return (
        <main className="mx-auto mt-35 mb-30 max-w-3xl px-6 font-nunito">
            <h1 className="mb-10 text-center text-3xl font-semibold">My Account</h1>

            <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-xl font-bold">Profile</h2>

                <dl className="space-y-4">
                    <div className="flex items-center gap-3">
                        <UserRound className="size-5 text-emerald-800" />
                        <dt className="sr-only">Name</dt>
                        <dd>{user.first_name} {user.last_name}</dd>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="size-5 text-emerald-800" />
                        <dt className="sr-only">Email</dt>
                        <dd>{user.email}</dd>
                    </div>
                </dl>
            </section>

            <Link
                href="/orders"
                className="mt-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:border-emerald-700"
            >
                <span className="flex items-center gap-3">
                    <Package className="size-5 text-emerald-800" />
                    <span className="font-semibold">My Orders</span>
                </span>
                <span className="text-sm text-zinc-500">See all your orders</span>
            </Link>
        </main>
    );
}
