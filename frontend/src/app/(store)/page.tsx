import { HeroSection } from "@/components/HeroSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { AboutSection } from "@/components/AboutSection";
import type { Pagination, Product } from "@/types";
import { serverApi } from "@/lib/api/server-api";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await serverApi<{
      ok: true, products: Product[], pagination: Pagination
    }>("/products?limit=4&sort=newest");
    return data.products;
  } catch {
    return [];
  }

}
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <AboutSection />
    </>
  );
}
