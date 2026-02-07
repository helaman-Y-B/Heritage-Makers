import Link from "next/link";
import Container from "@/components/layout/Container";
//import { formatPrice, getProductById } from "@/lib/products";
import getProducts from "@/models/getProducts";
import Image from "next/image";
import styles from "./details.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  console.log("Product ID from URL:", id); // Debug log to check the ID
  const products = await getProducts();

  const product = products.find((p) => p.id === parseInt(id));

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
