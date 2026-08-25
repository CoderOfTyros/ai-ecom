"use client";

import { Bookmark } from "lucide-react";


export function AddToWishListButton() {
    return (
        <button type="button" className="h-10 w-10 flex justify-center items-center rounded-full border text-emerald-700 border-gray-300 transition hover:border-emerald-700 cursor-pointer">
            <Bookmark aria-hidden={true} className="h-5 w-5" />
        </button>
    )
}