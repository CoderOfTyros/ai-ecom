import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, Package, Truck } from "lucide-react";

import { AboutSection } from "@/components/AboutSection";

export const metadata: Metadata = {
    title: "About Us"
};

const howWeWork = [
    {
        title: "Cash on Delivery",
        text: "Pay when your order arrives. No card needed.",
        icon: Banknote
    },
    {
        title: "Free shipping from $50",
        text: "Orders under $50 have a flat $5 shipping fee.",
        icon: Truck
    },
    {
        title: "Track your orders",
        text: "See every order and its status in your account.",
        icon: Package
    }
];

export default function AboutPage() {
    return (
        <div className="mt-20 font-nunito">
            <AboutSection showLearnMore={false} />

            <section className="mx-auto max-w-5xl px-6 py-20">
                <h2 className="text-center text-3xl font-bold">How we work</h2>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {howWeWork.map(({ title, text, icon: Icon }) => (
                        <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
                            <Icon className="mx-auto size-8 text-emerald-800" />
                            <h3 className="mt-4 text-lg font-bold">{title}</h3>
                            <p className="mt-2 text-zinc-600">{text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-14 text-center">
                    <Link
                        href="/products"
                        className="inline-block rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-900"
                    >
                        Shop now
                    </Link>
                </div>
            </section>
        </div>
    );
}
