import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
    title: "Wishlist"
};

// The wishlist feature is not built yet. This page keeps the navbar link working.
export default function WishlistPage() {
    return (
        <main className="mx-auto mt-35 mb-30 max-w-3xl px-6 text-center font-nunito">
            <Heart className="mx-auto size-14 text-emerald-800" />

            <h1 className="mt-6 text-3xl font-semibold">Wishlist coming soon</h1>

            <p className="mt-3 text-zinc-500">
                Soon you can save products you love and find them here later.
            </p>

            <Link
                href="/products"
                className="mt-10 inline-block rounded-full bg-emerald-900 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
                Browse products
            </Link>
        </main>
    );
}
