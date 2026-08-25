import Link from "next/link";

import { Heart, ShoppingCartIcon } from "lucide-react";
import { UserMenu } from "./UserMenu";

export interface NavbarUser {
    first_name: string;
    last_name: string;
    email: string;
}

interface NavbarActionsProps {
    user: NavbarUser;
    cartCount?: number;
}

export default function NavbarActions({ user, cartCount = 0 }: NavbarActionsProps) {

    return (
        <div className="flex items-center gap-x-4 mr-8">
            <Link href="/wishlist" className="flex gap-2 items-center">
                <Heart className="size-5" />
                <span className="hidden lg:inline">Wishlist</span>
            </Link>

            <Link href="/cart" className="flex gap-2 items-center">
                <ShoppingCartIcon className="size-5" />
                <span className="hidden lg:inline">Cart</span>
                {
                    cartCount > 0 && (
                        <span>
                            {cartCount > 99 ? "99+" : cartCount}
                        </span>
                    )
                }
            </Link>
            <UserMenu user={user} />
        </div>
    );
}