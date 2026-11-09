export const FREE_SHIPPING_MIN_CENTS = 5000;
const SHIPPING_PRICE_CENTS = 500;


export function calcShippingCents(subtotalCents) {
    if (subtotalCents <= 0) {
        return 0;
    }

    return subtotalCents >= FREE_SHIPPING_MIN_CENTS ? 0 : SHIPPING_PRICE_CENTS;
}