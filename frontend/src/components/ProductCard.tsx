import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";


export function ProductCard({ product }: { product: Product }) {
    const outOfStock = product.stock_quantity <= 0;


    return (
        <Link href={`/products/${product.id}`} className="group flex flex-col">
            {product.image_url ? (<div>
                <Image src={product.image_url} alt={product.name} fill className="transition group-hover:scale-105"></Image>
            </div>) : (
                <div className="text-gray-400">No Image</div>
            )}
            {outOfStock && (<div>
                <span> OUT OF STOCK</span>
            </div>)}
            <div>
                <h3>{product.name}</h3>
                <span>{formatPrice(product.price_cents)}</span>
                <span>{product.category}</span>
            </div>
        </Link>
    )
}