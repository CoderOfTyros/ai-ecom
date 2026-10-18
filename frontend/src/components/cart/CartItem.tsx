import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/lib/format";

interface CartItemProps {
    item: CartItemType;
    disabled: boolean;
    pending: boolean;
    onQuantityChange: (itemId: number, quantity: number) => Promise<void>;
    onRemove: (itemId: number) => Promise<void>;
}


export default function CartItem({ item, disabled, pending, onQuantityChange, onRemove }: CartItemProps) {
    const { product, quantity } = item;

    const maxQuantity = Math.min(product.stock_quantity, 99);
    const itemTotal = product.price_cents * quantity;

    return (
        <article className={`flex gap-x-5  p-2  transition-opacity ${pending ? "opacity-60" : ""}`}>
            <Link href={`/products/${product.slug}`} className="relative size-29 rounded-lg overflow-hidden">
                {product.image_url ? (
                    <Image
                        fill
                        className="p-2"
                        src={product.image_url}
                        alt={product.name} />
                ) : (
                    <div className="h-full text-center text-sm text-gray-400">
                        No Image
                    </div>
                )}
            </Link>
            <div className="flex flex-col w-[300]">
                <span className="uppercase text-gray-400 tracking-wide text-sm">{product.category}</span>
                <Link
                    className="font-bold text-md hover:text-zinc-800"
                    href={`/products/${product.slug}`}>
                    {product.name}
                </Link>
            </div>


            <div className="flex items-center gap-12">
                <div
                    role="group"
                    aria-label={`Quantity for ${product.name}`}
                    className="flex items-center  border-2 border-emerald-800 rounded-lg px-2"
                >
                    <button
                        className="text-gray-700 cursor-pointer disabled:cursor-auto disabled:text-gray-400 flex items-center justify-center"
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={disabled || quantity <= 1}
                        onClick={() => onQuantityChange(item.id, quantity - 1)}
                    >{<Minus className="size-4" />}</button>

                    <span className="w-10 text-center font-semibold">{quantity}</span>

                    <button
                        className="text-gray-700 cursor-pointer disabled:cursor-auto disabled:text-gray-400 flex items-center justify-center"
                        type="button"
                        aria-label="Increase quantity"
                        disabled={disabled || quantity >= maxQuantity}
                        onClick={() => onQuantityChange(item.id, quantity + 1)}
                    >
                        {<Plus className="size-4" />}
                    </button>
                </div>
                <div className="font-semibold text-zinc-700 w-40 text-center">
                    {formatPrice(itemTotal)}
                </div>

                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    disabled={disabled}
                >
                    <Trash2 className="size-5 text-emerald-800 hover:text-emerald-700 cursor-pointer" />

                </button>

            </div>



        </article >
    );
}
