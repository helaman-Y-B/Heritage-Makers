// src/components/products/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";
import { Product } from "@/types/product";
import ProductActions from "./ProductActions";
import { useEffect, useState } from "react";
/* SC: Added UI feedback for "Add to order" (useEffect + justAdded state) */

import { addToCart } from "@/lib/cart"; // Import the addToCart function (SC)

type Props = {
  product: Product;
  canCreateOrder: boolean;
  canManageAny: boolean;
  canManageOwn: boolean;
  currentUserId?: number;
  userKey?: string; // SC: NEW - stable key (email preferred) for per-user cart
};

export default function ProductCard({
  product,
  canCreateOrder,
  canManageAny,
  canManageOwn,
  currentUserId,
  userKey, // SC: NEW
}: Props) {
  let safeImgPath =
    typeof product.img_path === "string" && product.img_path.trim()
      ? product.img_path.startsWith("/")
        ? product.img_path
        : `/${product.img_path}`
      : "/productsImg/placeHolder.png";

  const [img, setImg] = useState(safeImgPath);

  /* SC: Added local UI feedback state for "Add to order" button */
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 900);
    return () => clearTimeout(t);
  }, [justAdded]);
  /* SC: End UI feedback state */

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
          <button
            className={styles.actionButton}
            type="button"
            /* SC: Ensure cart is saved per-user by using a stable key (email preferred). */
            onClick={() => {
              const effectiveUserKey =
                userKey ?? (currentUserId ? String(currentUserId) : undefined); // SC: stable key preference

              addToCart(
                {
                  id: String(product.id),
                  name: product.product_name,
                  price: Number(product.price),
                  imageUrl: product.img_path,
                },
                1,
                effectiveUserKey // SC: use effective per-user key
              );
              setJustAdded(true);
            }}
            /* SC: End per-user cart save */
            style={{
              transform: justAdded ? "scale(1.03)" : "scale(1)",
              transition: "transform 120ms ease",
            }}
          >
            {justAdded ? "Added!" : "Add to order"}
          </button>
        ) : (
          <p className={styles.restricted}>Buyers can place orders</p>
        )}
        {/* SC: End click feedback */}

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
/* SC: End UI feedback for "Add to order" */
