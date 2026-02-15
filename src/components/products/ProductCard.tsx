"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";
import { Product } from "@/types/product";
import ProductActions from "./ProductActions";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

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
  /**
   * Normalizes image input so each product card always has a valid image path.
   * If the stored path is empty or malformed, we fall back to a placeholder.
   */
  const safeImgPath =
    typeof product.img_path === "string" && product.img_path.trim()
      ? product.img_path.startsWith("/")
        ? product.img_path
        : `/${product.img_path}`
      : "/productsImg/placeHolder.png";

  const [img, setImg] = useState(safeImgPath);
  const { addItem } = useCart();

  function handleAddToCart() {
    /**
     * Adds this product to the client-side cart.
     * This is only available to users with `create_order` permission (buyers).
     */
    addItem({
      productId: product.id,
      name: product.product_name,
      price: Number(product.price),
      imgPath: safeImgPath,
      makerName: `${product.firstname} ${product.lastname}`.trim(),
    });
  }

  return (
    <article className={styles.card}>
      <div className={styles.thumb}>
        <Image
          src={img}
          alt={product.product_name}
          fill
          sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 33vw"
          className={styles.image}
          onError={() => setImg("/productsImg/placeHolder.png")}
        />
      </div>

      <div className={styles.meta}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{product.product_name}</h3>
          {product.isSustainable && <span className={styles.badge}>Sustainable</span>}
        </div>

        <p className={styles.muted}>
          By{" "}
          <Link className={styles.makerLink} href={`/makers/${product.user_id}`}>
            <strong>{product.firstname}</strong>
          </Link>{" "}
          | {product.category}
        </p>

        <p className={styles.muted}>
          Rating: {product.rating} ({product.reviewsCount})
          {!product.inStock && " | Out of stock"}
        </p>

        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price}</span>
          <Link className={styles.link} href={`/products/${product.id}`}>
            View details -&gt;
          </Link>
        </div>

        {canCreateOrder ? (
          <button className={styles.actionButton} type="button" onClick={handleAddToCart}>
            Add to cart
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
