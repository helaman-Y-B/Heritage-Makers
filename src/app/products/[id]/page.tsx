import Link from "next/link";
import Container from "@/components/layout/Container";
import { formatPrice, getProductById } from "@/lib/products";
import styles from "./details.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <Container>
        <div className={styles.wrap}>
          <Link className={styles.back} href="/products">
            ← Back to products
          </Link>

          <div className={styles.panel}>
            <h1 className={styles.title}>Product not found</h1>
            <p className={styles.muted}>
              The product you’re looking for doesn’t exist (yet).
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.wrap}>
        <Link className={styles.back} href="/products">
          ← Back to products
        </Link>

        <article className={styles.panel}>
          <div className={styles.heroRow}>
            <div className={styles.thumb} aria-hidden="true" />

            <div>
              <h1 className={styles.title}>{product.name}</h1>

              <p className={styles.muted}>
                By <strong>{product.maker}</strong> • {product.category}
              </p>

              <p className={styles.muted}>
                ⭐ {product.rating} ({product.reviewsCount})
                {!product.inStock && " • Out of stock"}
              </p>

              <p className={styles.price}>{formatPrice(product.price)}</p>

              <div className={styles.buttonRow}>
                <button className={styles.button} disabled={!product.inStock}>
                  {product.inStock ? "Add to cart (Week 5)" : "Out of stock"}
                </button>
                <button className={`${styles.button} ${styles.secondary}`}>
                  Save (Week 6)
                </button>
              </div>
            </div>
          </div>

          <p className={styles.muted}>{product.description}</p>
        </article>
      </div>
    </Container>
  );
}
