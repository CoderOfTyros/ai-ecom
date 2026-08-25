import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export function FeaturedProductCard({ product }: ProductCardProps) {
    const outOfStock = product.stock_quantity <= 0;


    return (
        <Link href={`/products/${product.slug}`} className="group flex flex-col w-full">
            {product.image_url ? (<div className="relative aspect-square overflow-hidden">
                <Image src={product.image_url} alt={product.name} fill className="object-cover transition group-hover:scale-105 rounded-md" />
            </div>) : (
                <div className="text-gray-400">No Image</div>
            )}
            {outOfStock && (<div>
                <span> OUT OF STOCK</span>
            </div>)}
            <div className="flex flex-col">
                <div>
                    <h3 className="inline text-2xl font-semibold truncate">{product.name}</h3>
                    <p className="text-emerald-900 font-semibold">{formatPrice(product.price_cents)}</p>
                </div>
                <span className="text-gray-500">{product.category}</span>
            </div>
        </Link>
    )
}