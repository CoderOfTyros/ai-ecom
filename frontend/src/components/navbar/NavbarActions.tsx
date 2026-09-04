import Link from "next/link";

import { Heart, ShoppingCartIcon } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useCart } from "@/context/CartContext";

interface NavbarActionsProps {
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function NavbarActions({ user }: NavbarActionsProps) {
    const { cartCount } = useCart();

    return (
        <div className="mr-8 flex items-center gap-x-4">
            <Link href="/wishlist" className="flex items-center gap-2">
                <Heart className="size-5" />
                <span className="hidden lg:inline">Wishlist</span>
            </Link>

            <Link href="/cart" className="flex items-center gap-2">
                <div className="relative">
                    <ShoppingCartIcon className="size-5" />

                    {cartCount > 0 && (
                        <span className="absolute -right-2 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                            {cartCount > 99 ? "99+" : cartCount}
                        </span>
                    )}
                </div>

                <span className="hidden lg:inline">Cart</span>
            </Link>

            <UserMenu user={user} />
        </div>
    );
}