import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
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
        <Link className={styles.secondaryBtn} href="/aboutUs">
          Meet the Makers
        </Link>
        <Link className={styles.secondaryBtn} href="/become-a-maker">
          Become a Maker
        </Link>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.badge}>Curated items</span>
        <span className={styles.badge}>Reviews and ratings</span>
        <span className={styles.badge}>Sustainable focus</span>
      </div>
    </section>
  );
}
