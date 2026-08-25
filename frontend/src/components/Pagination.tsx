"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Pagination as PaginationType } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";


export function Pagination({ pagination }: { pagination: PaginationType }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const { page, totalPages } = pagination;

    function goToPage(target: number) {
        const params = new URLSearchParams(searchParams.toString());
        if (target <= 1) params.delete("page");
        else params.set("page", String(target));

        const queryString = params.toString();
        startTransition(() => {
            router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
        })
    }


    return (
        <nav aria-label="Pagination" className="flex justify-center gap-3 mb-10" aria-busy={isPending}>
            
                <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={isPending || page <= 1}
                    className="cursor-pointer text-emerald-700 hover:text-emerald-900 font-semibold disabled:text-gray-300 disabled:cursor-auto"
                >
                    <ChevronLeft className="size-5"/>
                </button>
            

            <div>
                <span>Page {page} of {totalPages}</span>
            </div>

            <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={isPending || page >= totalPages}
                className=" cursor-pointer text-emerald-700 hover:text-emerald-900 font-semibold disabled:text-gray-300 disabled:cursor-auto"
            >
                <ChevronRight className="size-5"/>
            </button>
        </nav>
    )

}