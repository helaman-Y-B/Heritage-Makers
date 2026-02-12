import Link from "next/link";
import styles from "./MakerCta.module.css";

export default function MakerCta() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>Are you a maker?</h2>
        <p className={styles.subtitle}>
          Share your craft with a community that values heritage-inspired,
          handmade work. Apply to become a maker and start selling.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryBtn} href="/become-a-maker">
            Become a Maker
          </Link>
          <Link className={styles.secondaryBtn} href="/aboutUs">
            Learn more
          </Link>
        </div>
      </div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Maker perks</h3>
        <ul className={styles.list}>
          <li>Showcase your story and products</li>
          <li>Manage your listings and orders</li>
          <li>Reach buyers who value craftsmanship</li>
        </ul>
      </div>
    </section>
  );
}
