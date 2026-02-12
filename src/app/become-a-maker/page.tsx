import Container from "@/components/layout/Container";
import styles from "./page.module.css";

export const metadata = {
  title: "Become a Maker | Heritage Makers",
};

export default function BecomeAMakerPage() {
  return (
    <Container>
      <section className={styles.hero}>
        <p className={styles.kicker}>Maker application</p>
        <h1 className={styles.title}>Bring your craft to Heritage Makers.</h1>
        <p className={styles.subtitle}>
          Tell us about your work, your process, and the kinds of products you
          create. We review applications to keep the marketplace curated and
          high quality.
        </p>
      </section>

      <section className={styles.formCard}>
        <h2 className={styles.formTitle}>Apply to become a maker</h2>
        <form className={styles.form}>
          <label className={styles.label}>
            Business or studio name
            <input className={styles.input} name="studioName" required />
          </label>
          <label className={styles.label}>
            What do you make?
            <input
              className={styles.input}
              name="craftType"
              placeholder="Textiles, pottery, jewelry..."
              required
            />
          </label>
          <label className={styles.label}>
            Tell us your story
            <textarea
              className={styles.textarea}
              name="story"
              rows={4}
              placeholder="Share your background and process"
              required
            />
          </label>
          <label className={styles.label}>
            Portfolio or shop link (optional)
            <input className={styles.input} name="portfolio" />
          </label>
          <button className={styles.button} type="submit">
            Submit application
          </button>
        </form>
      </section>
    </Container>
  );
}
