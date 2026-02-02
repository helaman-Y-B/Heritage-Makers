import styles from "./AuthShell.module.css";
import Container from "@/components/layout/Container";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <Container>
      <section className={styles.shell}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </header>

          <div className={styles.body}>{children}</div>
        </div>
      </section>
    </Container>
  );
}
