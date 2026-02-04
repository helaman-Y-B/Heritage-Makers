import Link from "next/link";
import styles from "./ProductCard.module.css";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <article className={styles.card}>
      <img
        className={styles.thumb}
        src={product.image}
        alt={product.name}
        loading="lazy"
      />

      <div className={styles.meta}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{product.name}</h3>
          {product.isSustainable && <span className={styles.badge}>Sustainable</span>}
        </div>

        <p className={styles.muted}>
          By <strong>{product.maker}</strong> • {product.category}
        </p>

        <p className={styles.muted}>
          ⭐ {product.rating} ({product.reviewsCount})
          {!product.inStock && " • Out of stock"}
        </p>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <Link className={styles.link} href={`/products/${product.id}`}>
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
}
