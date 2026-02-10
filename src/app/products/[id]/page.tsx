import Link from "next/link";
import Container from "@/components/layout/Container";
import getProductById from "@/models/getProductById";
import Image from "next/image";
import styles from "./details.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (!Number.isFinite(parsedId)) {
    return (
      <Container>
        <div className={styles.wrap}>
          <Link className={styles.back} href="/products">
            â† Back to products
          </Link>

          <div className={styles.panel}>
            <h1 className={styles.title}>Product not found</h1>
            <p className={styles.muted}>
              The product youâ€™re looking for doesnâ€™t exist (yet).
            </p>
          </div>
        </div>
      </Container>
    );
  }

  let productRow;
  try {
    productRow = await getProductById(parsedId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("missing_connection_string") || message.includes("POSTGRES_URL")) {
      return (
        <Container>
          <div className={styles.wrap}>
            <Link className={styles.back} href="/products">
              â† Back to products
            </Link>

            <div className={styles.panel}>
              <h1 className={styles.title}>Database not configured</h1>
              <p className={styles.muted}>
                Set POSTGRES_URL in your .env.local to load this product.
              </p>
            </div>
          </div>
        </Container>
      );
    }
    throw error;
  }

  const product = productRow
    ? { ...productRow, isSustainable: Boolean(productRow.isSustainable) }
    : undefined;

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
            <Image src={product.img_path} width={300} height={300} alt={product.product_name} className={styles.thumb} aria-hidden="true"/>
              <h1 className={styles.title}>{product.product_name}</h1>

              <p className={styles.muted}>
                By <strong>{product.firstname + " " + product.lastname}</strong> • {product.category}
              </p>

              <p className={styles.muted}>
                ⭐ {product.rating} ({product.reviewsCount})
                {!product.inStock && " • Out of stock"}
              </p>

              <p className={styles.price}>${product.price}</p>

              <div className={styles.buttonRow}>
                <button className={styles.button} disabled={!product.inStock}>
                  {product.inStock ? "Add to cart (Week 5)" : "Out of stock"}
                </button>
                <button className={`${styles.button} ${styles.secondary}`}>
                  Save (Week 6)
                </button>
              </div>
            </div>

          <p className={styles.muted}>{product.product_description}</p>
        </article>
      </div>
    </Container>
  );
}
