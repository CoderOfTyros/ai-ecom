"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, Package, UserRound, LogOut } from "lucide-react";

interface UserMenuProps {
    user: {
        first_name: string;
        last_name: string;
        email: string;
    }
}

export function UserMenu({ user }: UserMenuProps) {
    const { logout } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const fullName = `${user.first_name} ${user.last_name}`;
    const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

    async function handleLogout() {
        if (loggingOut) return;

        try {
            setLoggingOut(true);
            await logout();
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <div className="relative">

            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="flex items-center gap-2"
            >
                <span className="flex size-9 justify-center items-center rounded-full border border-white">{initials}</span>
                <span>{fullName}</span>
                <ChevronDown className="size-4" />
            </button>

            {isOpen && (
                <div className="absolute w-full mt-3 bg-zinc-900 p-2  rounded-xl">

                    <Link
                        href="/account"
                        className="flex items-center text-sm gap-3 px-4 py-1 transition text-zinc-300 hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        <UserRound className="size-4" />
                        My Account
                    </Link>

                    <Link
                        href="/orders"
                        className="flex items-center text-sm gap-3 px-4 py-1 transition text-zinc-300 hover:text-white"
                        onClick={() => setIsOpen(false)}>
                        <Package className="size-4" />
                        Orders
                    </Link>

                    <div className="my-2 border-t border-zinc-300" />

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center text-sm gap-3 cursor-pointer px-4 text-zinc-300 transition hover:text-white"
                    >
                        <LogOut className="size-4" />
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>

                </div>
            )}
        </div>
    );
}