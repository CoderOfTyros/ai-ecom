import type { CartSummary } from "@/types/cart";
import { formatPrice } from "@/lib/format";


export function CartSummaryCard({ summary }: { summary: CartSummary }) {
    return (
        <aside className="w-full">
            <div className="w-3/5 mx-auto mt-10 border border-zinc-300 py-10 px-10 rounded-lg">
                <h2 className="text-xl font-bold font-nunito text-center">Order Summary</h2>
                <div className="flex flex-col mt-10 gap-y-4">
                    <div className="flex justify-between font-nunito">
                        <span className="font-bold">Subtotal</span>
                        <span>{formatPrice(summary.subtotal_cents)}</span>
                    </div>
                    <div className="flex justify-between font-nunito">
                        <span className="font-bold">Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>
                </div>


                <button
                    type="button"
                    className="mx-auto mt-20 flex w-full h-full text-sm justify-center items-center  bg-emerald-800 text-white rounded-lg px-6 gap-2 py-2 cursor-pointer transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-gray-800"
                >
                    Checkout
                </button>
            </div>
        </aside>
    );
}