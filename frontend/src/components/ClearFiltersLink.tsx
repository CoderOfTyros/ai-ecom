"use client";

import { useRouter, usePathname } from "next/navigation";


export function ClearFiltersLink() {
    const router = useRouter();
    const pathname = usePathname();

    function clearProductFilters() {
        router.push(pathname, { scroll: false });
    }
    return (
        <button
            type="button"
            onClick={clearProductFilters }
        ></button>
    );
}