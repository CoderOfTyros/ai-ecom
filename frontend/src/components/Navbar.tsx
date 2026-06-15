"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export function Navbar() {
    const { user, loading, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    async function handleLogout() {
        setLoggingOut(true);
        await logout();
        setLoggingOut(false);
    }

    useEffect(() => {
        function handleScroll() {
            const isScrolled = window.scrollY > window.innerHeight;
            setScrolled((prev) => (isScrolled !== prev ? isScrolled : prev));
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        // passive: true -> tells browser there's no need to check for preventDefault in function (so no lag)

        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    return (

        <nav className={`font-nunito w-full fixed z-50 top-0 text-white flex justify-between items-center h-20 ${scrolled ? "bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700" : "bg-transparent"} `} >
            <div className="ml-10 mt-5 flex gap-x-6">
                <Link href="/">Products</Link>
                <Link href="/">About</Link>
            </div>
            {
                loading ? (<div className="h-10 w-1/10 animate-pulse rounded bg-emerald-700" />) :
                    user ? (
                        <div className="mr-5 flex gap-x-2">
                            <Link href="/">Cart</Link>
                            <Link href="/">Orders</Link>
                            <button onClick={handleLogout} disabled={loggingOut}>{loggingOut ? "..." : "Logout"}</button>
                        </div>) : (
                        <div className="mr-8 mt-5 flex gap-x-4">
                            <Link href="/login">Login</Link>
                            <Link href="/register">Register</Link>
                        </div>
                    )
            }

        </nav >

    )
}