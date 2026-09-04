"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavbarActions from "./NavbarActions";

export function Navbar() {
    const { user, loading } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    const pathname = usePathname();

    const isHomePage = pathname === "/";



    useEffect(() => {
        if (!isHomePage) return;

        function handleScroll() {
            const isScrolled = window.scrollY > window.innerHeight;
            setScrolled((prev) => (isScrolled !== prev ? isScrolled : prev));
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        // passive: true -> tells browser there's no need to check for preventDefault in function (so no lag)

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHomePage]);

    const transparent = isHomePage && !scrolled;

    return (

        <nav className={`font-nunito w-full fixed z-50 top-0 text-white flex justify-between items-center h-20 ${transparent ? "bg-transparent" : "bg-emerald-900"} `} >
            <div className="ml-10 flex items-center h-full gap-x-6">
                <Link href="/">Home</Link>
                <Link href="/products">Products</Link>
            </div>
            {
                loading ? (<div />) :
                    user ? (
                        <div className="mr-5 flex gap-x-2">
                            <NavbarActions user={user} />

                        </div>) : (
                        <div className="mr-8 h-full items-center justify-center flex gap-x-4">
                            <Link href="/login">Login</Link>
                            <Link href="/register">Register</Link>
                        </div>
                    )
            }

        </nav >

    );
}