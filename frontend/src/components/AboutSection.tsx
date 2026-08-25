import { AboutFeatureCard } from "./AboutFeatureCard";
import Link from "next/link";
import { ShieldCheck, Truck, UsersRound } from "lucide-react";

const features = [
    { title: "Trusted Quality", description: "Products tested and chosen with care.", icon: ShieldCheck },
    { title: "Fast Delivery", description: "Quick and reliable shipping to your doorstep.", icon: Truck },
    { title: "Customer Focused", description: "Your satisfaction drives everything we do.", icon: UsersRound },
];

export function AboutSection() {
    return (
        <section className="bg-gray-200 w-full py-20 border-t border-zinc-300">
            <div className="max-w-7xl flex flex-col items-center mx-auto gap-y-4">
                <p className="text-emerald-800 uppercase font-bold font-nunito tracking-wide">About Us</p>
                <h2 className="text-3xl font-bold font-nunito">We make tech simple.</h2>
                <p className="text-zinc-600 max-w-2xl text-center">Our mission is to make the latest technology accessible to everyone.<br />
                    From powerful devices to everyday essentials, <br />we curate products
                    that deliver real value and an exceptional experience.</p>
                <div className="grid md:grid-cols-3 mt-14 md:divide-x md:divide-zinc-300 md:gap-0 gap-10">
                    {features.map((feature) => (
                        <AboutFeatureCard
                            key={feature.title}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon} />
                    ))}
                </div>

                <div className="mt-12 ">
                    <Link href="/about" className="font-semibold bg-emerald-800 text-white px-6 py-3 rounded-xl">Learn More About Us</Link>
                </div>
            </div>
        </section>
    )
}