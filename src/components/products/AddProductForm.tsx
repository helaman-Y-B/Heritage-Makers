"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddProductForm.module.css";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductSchema, AddProductInput } from "@/lib/auth/validationSchema";

type Props = {
  enabled: boolean;
};

const categories = ["Ceramics", "Woodwork", "Art", "Textiles", "Jewelry"] as const;

export default function AddProductForm({ enabled }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) return null;

  const { register, handleSubmit, formState: { errors } } = useForm<AddProductInput>({
        resolver: zodResolver(addProductSchema) as unknown as Resolver<AddProductInput>,
      });
  
      console.log("Form errors:", errors);

  const onSubmit = async (data: AddProductInput) => {
    setLoading(true);
    setError(null);
    const form = document.querySelector("form");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.row}>
        <label className={styles.label}>
          Name
          <input className={styles.input} {...register("product_name")} name="product_name" required />
          {errors.product_name && <p className={styles.error}>{errors.product_name.message}</p>}
        </label>
        <label className={styles.label}>
          Price
          <input className={styles.input} {...register("price", { valueAsNumber: true })} name="price" type="number" step="0.01" required />
          {errors.price && <p className={styles.error}>{errors.price.message}</p>}
        </label>
        <label className={styles.label}>
          Category
          <select className={styles.input} {...register("category")} name="category" defaultValue="Ceramics" required>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className={styles.error}>{errors.category.message}</p>}
        </label>
      </div>

      <label className={styles.label}>
        Image path (e.g. `/productsImg/ceramic-plates.jpg`)
        <input className={styles.input} {...register("img_path")} name="img_path" required />
        {errors.img_path && <p className={styles.error}>{errors.img_path.message}</p>}
      </label>

      <label className={styles.label}>
        Description
        <textarea className={styles.textarea} {...register("description")} name="description" rows={3} required />
        {errors.description && <p className={styles.error}>{errors.description.message}</p>}
      </label>

      <div className={styles.row}>
        <label className={styles.checkbox}>
          <input type="checkbox" {...register("inStock")} name="inStock" defaultChecked />
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
