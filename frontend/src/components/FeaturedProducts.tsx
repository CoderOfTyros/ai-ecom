import Link from "next/link";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface featuredProductsProps {
    products: Product[];
}


export function FeaturedProducts({ products }: featuredProductsProps) {

    return (
        <section>
            <h2>Featured Products</h2>
            <p>Our latest arrivals</p>

            {products.length === 0 ? (
                <p>No products available</p>
            ) : (
                <div>
                    {products.map((product) => (<ProductCard key={product.id} product={product} />))}
                </div>
            )}

            <div>
                <Link href="/products">View All Products</Link>
            </div>
        </section>
    );
}