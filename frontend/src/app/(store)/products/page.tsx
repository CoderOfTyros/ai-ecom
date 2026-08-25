import { serverApi } from "@/lib/api/server-api";
import { Product, Pagination as PaginationType } from "@/types";
import { ProductFilters } from "@/components/ProductFilters";
import { ClearFiltersLink } from "@/components/ClearFiltersLink";
import { GridProductCard } from "@/components/cards/GridProductCard";
import { Pagination } from "@/components/Pagination";

type SearchParams = Record<string, string | string[] | undefined>;

function buildProductQueryString(searchParams: SearchParams): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
        if (value == null) continue;
        if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
        else params.set(key, value);

    }
    return params.toString();
}

export default async function ProductsPage(
    { searchParams }: { searchParams: Promise<SearchParams> }) {

    const currentSearchParams = await searchParams;
    const queryString = buildProductQueryString(currentSearchParams);

    const apiUrl = `/products${queryString ? `?${queryString}` : ""}`;

    const { products, pagination } = await serverApi<{
        ok: true;
        products: Product[];
        pagination: PaginationType
    }>(apiUrl, { next: { revalidate: 30 } });

    const hasActiveSearchOrFilters = Boolean(
        currentSearchParams.search ||
        currentSearchParams.category ||
        currentSearchParams.minPrice ||
        currentSearchParams.maxPrice);


    return (
        <div className="min-h-[80vh] mt-20 max-w-7xl mx-auto">
            {/* <h1>Products</h1> */}
            <ProductFilters />

            {hasActiveSearchOrFilters && (
                <div>
                    <ClearFiltersLink />
                </div>
            )
            }

            {products.length === 0 ?
                <p>No products found.</p> :
                <>
                    <div className="mx-auto max-w-6xl my-12 grid grid-cols-2 gap-12 md:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) =>
                            (<GridProductCard key={product.id} product={product} />)
                        )}
                    </div>
                    {
                        pagination.totalPages > 1 && (
                        <Pagination pagination={pagination} />
                    )
                    }
                </>
            }
        </div>
    );
}