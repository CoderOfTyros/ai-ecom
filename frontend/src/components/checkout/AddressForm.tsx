import type { ShippingAddress } from "@/types/order";

interface AddressFormProps {
    values: ShippingAddress;
    fieldErrors: Record<string, string>;
    disabled: boolean;
    onChange: (field: keyof ShippingAddress, value: string) => void;
}

// Same limits as the backend schema (backend/src/validation/schemas.js).
// The backend still checks everything; these only help the user early.
const FIELDS: {
    name: keyof ShippingAddress;
    label: string;
    required: boolean;
    maxLength: number;
    autoComplete: string;
    wide?: boolean;
}[] = [
    { name: "full_name", label: "Full name", required: true, maxLength: 100, autoComplete: "name" },
    { name: "phone", label: "Phone number", required: true, maxLength: 30, autoComplete: "tel" },
    { name: "line1", label: "Street address", required: true, maxLength: 200, autoComplete: "address-line1", wide: true },
    { name: "line2", label: "Apartment / Building", required: false, maxLength: 200, autoComplete: "address-line2", wide: true },
    { name: "city", label: "City", required: true, maxLength: 100, autoComplete: "address-level2" },
    { name: "region", label: "Region", required: false, maxLength: 100, autoComplete: "address-level1" },
    { name: "postal_code", label: "Postal code", required: false, maxLength: 30, autoComplete: "postal-code" },
    { name: "country", label: "Country", required: true, maxLength: 100, autoComplete: "country-name" }
];

export default function AddressForm({ values, fieldErrors, disabled, onChange }: AddressFormProps) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Shipping Address</h2>

            <div className="grid gap-5 md:grid-cols-2">
                {FIELDS.map((field) => {
                    const error = fieldErrors[field.name];

                    return (
                        <div key={field.name} className={field.wide ? "md:col-span-2" : ""}>
                            <label htmlFor={field.name} className="mb-2 block text-sm font-medium">
                                {field.label}
                                {!field.required && <span className="text-zinc-400"> (optional)</span>}
                            </label>

                            <input
                                id={field.name}
                                name={field.name}
                                type={field.name === "phone" ? "tel" : "text"}
                                autoComplete={field.autoComplete}
                                required={field.required}
                                maxLength={field.maxLength}
                                value={values[field.name] ?? ""}
                                disabled={disabled}
                                aria-invalid={Boolean(error)}
                                onChange={(e) => onChange(field.name, e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-emerald-700 disabled:bg-zinc-50"
                            />

                            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
