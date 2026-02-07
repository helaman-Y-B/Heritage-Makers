import Link from "next/link";
import styles from "./ProductCard.module.css";
import { Product } from "@/types/product";
import Image from "next/image";
//import { formatPrice } from "@/lib/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <article className={styles.card}>
      {/* Week 4: placeholder “image” block (we’ll add real images later) */}
      <Image src={product.img_path} width={300} height={300} alt={product.product_name} className={styles.thumb} aria-hidden="true"/>
      <div className={styles.meta}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{product.product_name}</h3>
          {product.isSustainable && <span className={styles.badge}>Sustainable</span>}
        </div>

        <p className={styles.muted}>
          By <strong>{product.firstname + " " + product.lastname}</strong> • {product.category}
        </p>

        <p className={styles.muted}>
          ⭐ {product.rating} ({product.reviewsCount})
          {!product.inStock && " • Out of stock"}
        </p>

        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price}</span>
          <Link className={styles.link} href={`/products/${product.id}`}>
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
}
