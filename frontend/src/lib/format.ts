export function formatPrice(cents: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(cents / 100);
}

// Shipping of 0 cents is shown as "Free"
export function formatShipping(cents: number): string {
    return cents === 0 ? "Free" : formatPrice(cents);
}
