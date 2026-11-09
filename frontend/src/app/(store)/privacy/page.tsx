import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
    title: "Privacy Policy"
};

// Starter text that describes what the app stores today.
// Have it checked before the shop goes live.
export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            updated="November 9, 2026"
            sections={[
                {
                    heading: "1. What we collect",
                    body: (
                        <ul className="list-disc space-y-1 pl-6">
                            <li>Account: your first name, last name, email, and password (we store only a secure hash, never the password itself).</li>
                            <li>Orders: the products you buy, and your delivery name, phone number, and address.</li>
                            <li>Cart: the products you add to your cart.</li>
                        </ul>
                    )
                },
                {
                    heading: "2. Why we use it",
                    body: (
                        <p>
                            We use this information to run your account, deliver your orders,
                            and contact you about an order. We do not sell your information.
                        </p>
                    )
                },
                {
                    heading: "3. Payment",
                    body: (
                        <p>
                            We accept Cash on Delivery only, so we do not collect or store card details.
                        </p>
                    )
                },
                {
                    heading: "4. Cookies",
                    body: (
                        <p>
                            We use one cookie to keep you logged in. We do not use advertising cookies.
                        </p>
                    )
                },
                {
                    heading: "5. Your choices",
                    body: (
                        <p>
                            To see, change, or delete your information, email us at{" "}
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
