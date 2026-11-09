import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
    title: "Terms of Service"
};

// Starter text that describes how the shop works today.
// Have it checked before the shop goes live.
export default function TermsPage() {
    return (
        <LegalPage
            title="Terms of Service"
            updated="November 9, 2026"
            sections={[
                {
                    heading: "1. Using our shop",
                    body: (
                        <p>
                            By using this website and placing an order, you agree to these terms.
                            You must give correct information when you create an account or place an order.
                        </p>
                    )
                },
                {
                    heading: "2. Orders",
                    body: (
                        <p>
                            An order is confirmed when you see the order page after checkout.
                            We may cancel an order, for example if a product is no longer available.
                            If we cancel your order, we tell you.
                        </p>
                    )
                },
                {
                    heading: "3. Prices and payment",
                    body: (
                        <p>
                            Prices are in US dollars. We accept Cash on Delivery only:
                            you pay the full total when your order arrives.
                        </p>
                    )
                },
                {
                    heading: "4. Shipping",
                    body: (
                        <p>
                            Shipping is free for orders of $50 or more. Orders under $50 have a flat $5 shipping fee.
                            Please make sure your delivery address and phone number are correct.
                        </p>
                    )
                },
                {
                    heading: "5. Contact",
                    body: (
                        <p>
                            Questions about these terms? Email us at{" "}
                            <a href="mailto:sameryassine@outlook.com" className="font-semibold text-emerald-800 underline">
                                sameryassine@outlook.com
                            </a>.
                        </p>
                    )
                }
            ]}
        />
    );
}
