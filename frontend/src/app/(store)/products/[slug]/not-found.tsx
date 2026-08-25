import Link from "next/link";

export default function ProductNotFound() {
    return (
        <div className="h-[80vh] mt-10 flex flex-col justify-center items-center">
            <p className="text-3xl">Sorry, we couldn&apos;t find that product.</p>
            <Link className="text-emerald-800 cursor-pointer font-semibold hover:text-emerald-700" href="/products">← Back to products</Link>
        </div>
    );
}