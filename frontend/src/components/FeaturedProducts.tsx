import Link from "next/link";
import type { Product } from "@/types";
import { FeaturedProductCard } from "./cards/FeaturedProductCard";

interface FeaturedProductsProps {
    products: Product[];
}


export function FeaturedProducts({ products }: FeaturedProductsProps) {

    return (
        <section className="flex flex-col items-center gap-10 mt-20 max-w-7xl mx-auto pb-20 pt-4">
            <div className="w-full text-center">
                <h2 className="text-5xl">Featured Products</h2>
                <p className="font-nunito text-xl mt-2">Our latest arrivals</p>
            </div>

            {products.length === 0 ? (
                <p>No products available</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-10 w-full">
                    {products.map((product) => (<FeaturedProductCard key={product.id} product={product} />))}
                </div>
            )}

            <div className="mt-5">
                <Link href="/products" className="bg-emerald-800 text-white px-4 py-2 rounded-xl ">View All Products</Link>
            </div>
        </section>
    );
}