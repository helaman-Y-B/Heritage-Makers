import Container from "@/components/layout/Container";
import styles from "./page.module.css";

export const metadata = {
  title: "Terms of Service | Heritage Makers",
};

export default function TermsPage() {
  return (
    <Container>
      <section className={styles.hero}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.subtitle}>
          These terms outline the basic rules for using Heritage Makers. This is
          a student project, so the language below is a friendly placeholder.
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.heading}>1. Accounts</h2>
        <p className={styles.body}>
          You agree to provide accurate information and keep your account secure.
        </p>

        <h2 className={styles.heading}>2. Marketplace Rules</h2>
        <p className={styles.body}>
          Only list items you created and that are legal to sell. No counterfeit
          or misleading listings.
        </p>

        <h2 className={styles.heading}>3. Orders & Disputes</h2>
        <p className={styles.body}>
          Orders are subject to maker policies. Disputes should be handled in
          good faith with the maker or support.
        </p>

        <h2 className={styles.heading}>4. Content Rights</h2>
        <p className={styles.body}>
          You own your content but grant us permission to display it on the site.
        </p>

        <h2 className={styles.heading}>5. Account Termination</h2>
        <p className={styles.body}>
          We may suspend accounts that violate these terms or harm the community.
        </p>
      </section>
    </Container>
  );
}
