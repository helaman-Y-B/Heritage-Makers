"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddProductForm.module.css";

type Props = {
  enabled: boolean;
};

const categories = ["Ceramics", "Woodwork", "Art", "Textiles", "Jewelry"] as const;

export default function AddProductForm({ enabled }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add product");
      }
      form?.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.label}>
          Name
          <input className={styles.input} name="product_name" required />
        </label>
        <label className={styles.label}>
          Price
          <input className={styles.input} name="price" type="number" step="0.01" required />
        </label>
        <label className={styles.label}>
          Category
          <select className={styles.input} name="category" defaultValue="Ceramics" required>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.label}>
        Image path (e.g. `/productsImg/ceramic-plates.jpg`)
        <input className={styles.input} name="img_path" required />
      </label>

      <label className={styles.label}>
        Description
        <textarea className={styles.textarea} name="product_description" rows={3} required />
      </label>

      <div className={styles.row}>
        <label className={styles.checkbox}>
          <input type="checkbox" name="inStock" defaultChecked />
          In stock
        </label>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add product"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
