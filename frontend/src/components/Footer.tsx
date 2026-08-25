import Link from "next/link";
import type { ElementType, SVGProps } from "react";
import { Mail } from "lucide-react";
import { SiInstagram, SiFacebook } from "@icons-pack/react-simple-icons";


type IconType = ElementType<SVGProps<SVGSVGElement>>

interface NavLink {
    label: string;
    href: string;
}

interface SocialLink {
    label: string;
    href: string;
    icon: IconType;
    external?: boolean;
}


const navLinks: NavLink[] = [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "About Us", href: "/about" },

];

const socials: SocialLink[] = [
    { label: "Instagram", href: "https://instagram.com", icon: SiInstagram, external: true },
    { label: "Facebook", href: "https://facebook.com", icon: SiFacebook, external: true },
    { label: "Email", href: "mailto:sameryassine@outlook.com", icon: Mail }
]

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-zinc-950 relative overflow-hidden">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-72
                   bg-[radial-gradient(80%_100%_at_50%_30%,rgba(16,185,129,0.25),transparent_70%)]"
            />
            <div className="relative">
                <div className="max-w-5xl mx-auto py-16">
                    <p className="max-w-xs mx-auto text-center text-zinc-300 ">Premium tech products designed to elevate your everyday performance.</p>
                    <nav className="mt-10">
                        <ul className="flex justify-center gap-x-14 gap-y-4 text-white">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="transition hover:text-emerald-400">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <ul className="mt-10 flex justify-center gap-4">
                        {socials.map((social) => {

                            const Icon = social.icon;
                            return (< li key={social.href} >
                                <a
                                    href={social.href}
                                    target={social.external ? "_blank" : undefined}
                                    rel={social.external ? "noopener noreferrer" : undefined}
                                    className="h-11 w-11 flex items-center justify-center border border-zinc-700 rounded-full transition hover:border-emerald-500 hover:text-emerald-400 text-zinc-300"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            </li>)
                        })}
                    </ul>
                </div>
            </div>
            <div className="border-t border-zinc-700">
                <div className="flex sm:flex-row sm:gap-6 gap-3 flex-col items-center justify-center py-10 text-zinc-400">
                    <span>© {year} All rights reserved.</span>
                    <span className="hidden h-4 w-px sm:block bg-zinc-600" />
                    <Link href="/privacy" className="transition hover:text-zinc-300">Privacy Policy</Link>
                    <span className="hidden h-4 w-px sm:block bg-zinc-600" />
                    <Link href="/terms" className="transition hover:text-zinc-300">Terms Of Services</Link>
                </div>
            </div>


        </footer >
    )
}