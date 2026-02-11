import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";
//import { products } from "@/lib/products";
import getProducts from "@/models/getProducts";
import styles from "./products.module.css";
import { Product } from "@/types/product";

export const metadata = {
  title: "Products | Heritage Makers",
};

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    products = (await getProducts()).map((p) => ({
      ...p,
      isSustainable: Boolean(p.isSustainable),
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("missing_connection_string") || message.includes("POSTGRES_URL")) {
      return (
        <Container>
          <header className={styles.header}>
            <h1 className={styles.title}>Products</h1>
            <p className={styles.sub}>
              Database connection is missing. Set POSTGRES_URL in your .env.local.
            </p>
          </header>
        </Container>
      );
    }
    throw error;
  }
  
  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.sub}>
          Browse heritage-inspired handmade pieces from local makers.
        </p>
      </header>

      {/* Week 4: UI-only “search” (not functional yet). We'll wire it in Week 4/5 */}
      <div className={styles.toolbar}>
        <input
          className={styles.input}
          placeholder="Search products (Week 4 UI)…"
          aria-label="Search products"
        />
      </div>

      <section className={styles.grid}>
        {products.map((p: any) => (
          <ProductCard key={p.id + p.firstname} product={p} />
        ))}
      </section>
    </Container>
  );
}
