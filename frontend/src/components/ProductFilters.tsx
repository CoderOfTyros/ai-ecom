"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition, useId, useCallback } from "react";
import { SearchIcon } from "lucide-react";


const CATEGORIES = ["phone", "laptop", "accessory", "mouse"];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
];

const DEFAULTS: Record<string, string> = { sort: "newest" };

export function ProductFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    const searchInputId = useId();
    const categoryId = useId();
    const sortId = useId();

    const searchFromUrl = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const sort = searchParams.get("sort") ?? "newest";

    const [searchInputValue, setSearchInputValue] = useState(searchFromUrl);

    const updateProductQueryParam = useCallback(
        (key: string, value: string, { replace = false } = {}) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== DEFAULTS[key]) {
                params.set(key, value);
            }
            else {
                params.delete(key);
            }
            params.delete("page");

            const queryString = params.toString();
            const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

            startTransition(() => {
                if (replace) router.replace(nextUrl, { scroll: false });
                else router.push(nextUrl, { scroll: false });
            });
        }, [router, pathname, searchParams]);

    // debouncing search
    useEffect(() => {
        if (searchInputValue === searchFromUrl) return;

        const timer = setTimeout(() => {
            updateProductQueryParam("search", searchInputValue, { replace: true });
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInputValue, searchFromUrl, updateProductQueryParam]);


    // syncs the search input value when the url search value changes externally like back button press
    useEffect(() => {
        setSearchInputValue(searchFromUrl);
    }, [searchFromUrl]);

    return (
        <div className="flex flex-col sm:flex-row w-3/4 mx-auto gap-3 items-center mt-30"
            aria-busy={isPending}
        >
            <div className="flex-1 relative">
                <label htmlFor={searchInputId} className="sr-only">
                    Search products
                </label>
                <SearchIcon className="h-6 w-6 left-3 top-1/2 -translate-y-1/2 absolute" />
                <input
                    type="search"
                    id={searchInputId}
                    placeholder="Search products..."
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    className="w-full py-2.5 pl-13 pr-2 rounded-2xl border-2 focus:outline-none text-sm  border-emerald-800"
                />

            </div>

            <div>
                <label htmlFor={categoryId} className="sr-only">
                    Category
                </label>
                <select
                    value={category}
                    id={categoryId}
                    onChange={(e) => updateProductQueryParam("category", e.target.value)}
                    className="text-sm px-2 border-2 border-gray-200 rounded-2xl bg-gray-100 text-gray-500 font-medium  py-2 cursor-pointer" >
                    <option value="">All categories</option>
                    {
                        CATEGORIES.map((categ) => (
                            <option key={categ} value={categ}>
                                {categ.charAt(0).toUpperCase() + categ.slice(1)}
                            </option>
                        ))
                    }

                </select>
            </div>

            <div>
                <label htmlFor={sortId} className="sr-only">
                    Sort by
                </label>
                <select
                    value={sort}
                    id={sortId}
                    onChange={(e) => updateProductQueryParam("sort", e.target.value)}
                    className="w-auto text-sm px-2 border-2 border-gray-200 rounded-2xl bg-gray-100 text-gray-500 font-medium  py-2 cursor-pointer" >

                    {
                        SORT_OPTIONS.map((sortOption) => (
                            <option
                                key={sortOption.value}
                                value={sortOption.value}>

                                {sortOption.label}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
}