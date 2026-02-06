import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/lib/products";
import getProducts from "@/models/getProducts";
import styles from "./products.module.css";

export const metadata = {
  title: "Products | Heritage Makers",
};

export default async function ProductsPage() {
  const products = await getProducts();

  console.log(products);
  
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
        {products.map((p) => (
          <ProductCard key={p.product_id} product={p} />
        ))}
      </section>
    </Container>
  );
}
