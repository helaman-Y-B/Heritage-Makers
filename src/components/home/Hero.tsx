"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Hero.module.css";

type HeroDetailKey = "curated" | "reviews" | "sustainable";

const HERO_DETAILS: Record<HeroDetailKey, { label: string; title: string; body: string }> = {
  curated: {
    label: "Curated items",
    title: "Curated items",
    body: "Each listing is reviewed for quality and originality so buyers can discover fewer, better handcrafted pieces.",
  },
  reviews: {
    label: "Reviews and ratings",
    title: "Reviews and ratings",
    body: "Product ratings and written feedback help shoppers make better decisions and help makers improve their listings.",
  },
  sustainable: {
    label: "Sustainable focus",
    title: "Sustainable focus",
    body: "Makers can highlight eco-friendly materials and low-waste methods to help customers shop responsibly.",
  },
};

export default function Hero() {
  /**
   * Tracks which hero detail chip is currently active.
   * Clicking a chip reveals a matching detail panel below the row.
   */
  const [activeDetail, setActiveDetail] = useState<HeroDetailKey>("curated");

  return (
    <section className={styles.hero}>
      <p className={styles.kicker}>Handcrafted goods - Local artisans - Sustainable shopping</p>

      <h1 className={styles.title}>Discover heritage-inspired handmade pieces.</h1>

      <p className={styles.subtitle}>
        Heritage Makers is a marketplace for unique handcrafted items. Browse products, meet artisans,
        and support creators with every purchase.
      </p>

      <div className={styles.actions}>
        <Link className={styles.primaryBtn} href="/products">
          Browse Products
        </Link>
        <Link className={styles.secondaryBtn} href="/makers">
          Meet the Makers
        </Link>
        <Link className={styles.secondaryBtn} href="/become-a-maker">
          Become a Maker
        </Link>
      </div>

      <div className={styles.metaRow}>
        {Object.entries(HERO_DETAILS).map(([key, detail]) => (
          <button
            key={key}
            className={`${styles.badgeButton} ${activeDetail === key ? styles.badgeButtonActive : ""}`}
            onClick={() => setActiveDetail(key as HeroDetailKey)}
            type="button"
          >
            {detail.label}
          </button>
        ))}
      </div>

      <section className={styles.detailPanel}>
        <h2 className={styles.detailTitle}>{HERO_DETAILS[activeDetail].title}</h2>
        <p className={styles.detailBody}>{HERO_DETAILS[activeDetail].body}</p>
      </section>
    </section>
  );
}
