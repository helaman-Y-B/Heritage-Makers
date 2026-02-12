import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";
import { Product } from "@/types/product";
import ProductActions from "./ProductActions";

type Props = {
  product: Product;
  canCreateOrder: boolean;
  canManageAny: boolean;
  canManageOwn: boolean;
  currentUserId?: number;
};

export default function ProductCard({
  product,
  canCreateOrder,
  canManageAny,
  canManageOwn,
  currentUserId,
}: Props) {
  const safeImgPath =
    typeof product.img_path === "string" && product.img_path.trim()
      ? product.img_path.startsWith("/")
        ? product.img_path
        : `/${product.img_path}`
      : "/productsImg/ceramic-plates.jpg";

  return (
    <article className={styles.card}>
      <div className={styles.thumb}>
        <Image
          src={safeImgPath}
          alt={product.product_name}
          fill
          sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 33vw"
          className={styles.image}
        />
      </div>

      <div className={styles.meta}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{product.product_name}</h3>
          {product.isSustainable && <span className={styles.badge}>Sustainable</span>}
        </div>

        <p className={styles.muted}>
          By <strong>{product.firstname}</strong> • {product.category}
        </p>

        <p className={styles.muted}>
          ★ {product.rating} ({product.reviewsCount})
          {!product.inStock && " • Out of stock"}
        </p>

        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price}</span>
          <Link className={styles.link} href={`/products/${product.id}`}>
            View details →
          </Link>
        </div>

        {canCreateOrder ? (
          <button className={styles.actionButton} type="button">
            Add to order
          </button>
        ) : (
          <p className={styles.restricted}>Buyers can place orders</p>
        )}

        <ProductActions
          product={product}
          canManageAny={canManageAny}
          canManageOwn={canManageOwn}
          currentUserId={currentUserId}
        />
      </div>
    </article>
  );
}
