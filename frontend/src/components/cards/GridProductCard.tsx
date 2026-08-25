import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "../buttons/AddToCartButton";
import { AddToWishListButton } from "../buttons/AddToWishListButton";


export function GridProductCard({ product }: { product: Product }) {
    const outOfStock = product.stock_quantity <= 0;


    return (
        <article className="flex flex-col rounded-2xl border border-gray-300 transition shadow-sm hover:shadow-md overflow-hidden">
            <Link href={`/products/${product.slug}`} className="group flex flex-col w-full">
                {
                    product.image_url ? (
                        <div className="relative aspect-square overflow-hidden">
                            <Image src={product.image_url} alt={product.name} fill className="object-contain transition group-hover:scale-105 rounded-md" />
                        </div>) : (
                        <div className="text-gray-400">No Image</div>
                    )}
                {/* {outOfStock && (<div>
                    <span> OUT OF STOCK</span>
                </div>)} */}
                <div className="flex flex-col p-4">
                    <div>
                        <h3 title={product.name} className="truncate font-semibold">{product.name}</h3>

                    </div>
                    <div className="flex justify-between gap-3 mt-3">
                        <span className="text-gray-500 capitalize">{product.category}</span>
                        <span className="text-emerald-900 font-semibold">{formatPrice(product.price_cents)}</span>
                    </div>
                </div>
            </Link>


            <div className="w-full flex justify-center mt-auto pb-4 items-center gap-x-10">
                <AddToCartButton product={product} disabled={outOfStock} />
                <AddToWishListButton />
            </div>

        </article>
    )
}