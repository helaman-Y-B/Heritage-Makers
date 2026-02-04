import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth/session";
import styles from "./products.module.css";

export const metadata = {
  title: "Products | Heritage Makers",
};

export default async function ProductsPage() {
  const currentUser = await getCurrentUser();
  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.sub}>
          Browse heritage-inspired handmade pieces from local makers.
        </p>
        <p className={styles.sub}>
          Current role: <strong>{currentUser.role}</strong> â€¢{" "}
          <a className={styles.link} href="/dev/role">
            Change role
          </a>
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
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </Container>
  );
}
