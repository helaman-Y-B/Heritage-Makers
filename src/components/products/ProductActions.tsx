"use client";

import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.css";
import { Product } from "@/types/product";

type Props = {
  product: Product;
  canManageAny: boolean;
  canManageOwn: boolean;
  currentUserId?: number;
};

export default function ProductActions({
  product,
  canManageAny,
  canManageOwn,
  currentUserId,
}: Props) {
  const router = useRouter();

  const canManage =
    canManageAny || (canManageOwn && currentUserId && product.user_id === currentUserId);

  if (!canManage) return null;

  async function handleDelete() {
    const ok = window.confirm(`Delete "${product.product_name}"?`);
    if (!ok) return;
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleEdit() {
    const nextName = window.prompt("Product name:", product.product_name);
    if (!nextName) return;
    const nextPriceRaw = window.prompt("Price:", String(product.price));
    if (!nextPriceRaw) return;
    const nextPrice = Number(nextPriceRaw);
    if (Number.isNaN(nextPrice)) return;
    const nextDesc = window.prompt("Description:", product.product_description);
    if (!nextDesc) return;

    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: nextName,
        product_description: nextDesc,
        price: nextPrice,
        category: product.category,
        img_path: product.img_path,
        inStock: product.inStock,
      }),
    });
    router.refresh();
  }

  return (
    <div className={styles.actionRow}>
      <button className={styles.actionLink} type="button" onClick={handleEdit}>
        Edit
      </button>
      <button
        className={`${styles.actionLink} ${styles.danger}`}
        type="button"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}
