import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { nunito, azonix, cardot } from "@/lib/fonts";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Store",
  description: "Ecommerce store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${azonix.variable} ${cardot.variable}`}>
      <body >
        <AuthProvider>
          <CartProvider>
            <main>
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
