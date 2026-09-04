import { notFound } from "next/navigation";
import { cache } from "react";
import { Product } from "@/types";
import { serverApi } from "@/lib/api/server-api";
import { ApiError } from "@/lib/api/ApiError";
import { Metadata } from "next";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { ProductPurchase } from "@/components/ProductPurchase";


const getProduct = cache(async (slug: string): Promise<Product | null> => {
    try {
        const { product } = await serverApi<{ ok: true; product: Product }>(
            `/products/${slug}`,
            { next: { revalidate: 30 } }
        );

        return product;

    } catch (err) {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
    }
})

export async function generateMetadata({ params }: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) return { title: "Product not found" };

    return {
        title: product.name,
        description: product.description ?? undefined,
        alternates: { canonical: `/products/${product.slug}` },
        openGraph: {
            title: product.name,
            description: product.description ?? undefined,
            images: product.image_url ? [{ url: product.image_url }] : undefined,
        },
    }
}

export default async function ProductDetailPage({ params }:
    { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) notFound();

    const outOfStock = product.stock_quantity <= 0;

    return (<div className="h-[70vh] mt-30 mb-30">
        <div className="h-[85%] max-w-5xl grid md:grid-cols-5 mx-auto">
            <div className="col-span-3 relative h-full overflow-hidden rounded-lg" >
                {
                    product.image_url ? (
                        <Image fill src={product.image_url} alt={product.name}  />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            No image
                        </div>
                    )
                }
            </div>

            <div className="col-span-2">
                <div className="ml-10 h-full flex flex-col gap-2">
                    <span className="uppercase text-gray-400 tracking-wide">{product.category}</span>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <div className="flex items-center mt-3 gap-x-5">
                        <p className="text-emerald-900 font-semibold text-lg ">{formatPrice(product.price_cents)}</p>
                        {outOfStock ? (<p className="text-sm font-semibold text-red-600">
                            Out of stock
                        </p>) : (<p className="font-semibold text-sm"> <span className="text-gray-500 font-bold">{product.stock_quantity}</span> In stock</p>)}
                    </div>
                    {product.description && (
                        <div className="mt-4 text-gray-600">
                            <p>{product.description}</p>
                        </div>
                    )}
                    <ProductPurchase product={product} />
                </div>
            </div>
        </div>
    </div>);
}