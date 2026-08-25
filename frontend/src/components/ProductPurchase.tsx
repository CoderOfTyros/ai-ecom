"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { AddToCartButton } from "./buttons/AddToCartButton";

export function ProductPurchase({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);

    const outOfStock = product.stock_quantity <= 0;

    if (outOfStock) return null;

    const maxQuantity = Math.min(product.stock_quantity, 99);

    function increaseQuantity() {
        setQuantity((currentQuantity) => Math.min(maxQuantity, currentQuantity + 1));
    }

    function decreaseQuantity() {
        setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
    }


    return (
        <div className="mt-10">

            <div className="h-11 flex items-center gap-3">
                <div role="group" aria-label="Quantity" className="h-full flex items-center rounded-full border-2 border-emerald-800">
                    <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="h-full w-11 cursor-pointer flex items-center justify-center text-gray-700 disabled:cursor-auto disabled:text-gray-400"
                    >
                        <Minus className="size-5" strokeWidth={2} />
                    </button>

                    <span className="text-lg min-w-6 text-center font-medium">{quantity}</span>

                    <button
                        onClick={increaseQuantity}
                        disabled={quantity >= maxQuantity}
                        aria-label="Increase quantity"
                        className="h-full w-11 cursor-pointer flex items-center justify-center text-gray-700 disabled:cursor-auto disabled:"
                    >
                        <Plus className="size-5" strokeWidth={2} />
                    </button>
                </div>

                <AddToCartButton product={product} quantity={quantity} disabled={outOfStock} className="flex-1 h-full"/>
            </div>
        </div>
    );

}