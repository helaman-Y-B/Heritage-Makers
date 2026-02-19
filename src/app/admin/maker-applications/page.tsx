import Container from "@/components/layout/Container";
import MakerApplicationsPanel from "@/components/admin/MakerApplicationsPanel";
import { requireAdminSession } from "@/lib/auth/adminAccess";
import styles from "../shared-admin.module.css";

export const metadata = {
  title: "Approve Makers | Heritage Makers",
};

export default async function AdminMakerApplicationsPage() {
  // Gate entire page on server so non-admins never see admin queue content.
  const admin = await requireAdminSession();
  if (!admin) {
    return (
      <Container>
        <section className={styles.section}>
          <h1 className={styles.title}>Admin Access Required</h1>
          <p className={styles.subtitle}>
            You must be signed in as an admin to review maker applications.
          </p>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className={styles.section}>
        <h1 className={styles.title}>Maker Applications</h1>
        <p className={styles.subtitle}>
          Review pending applications and approve successful applicants as makers.
        </p>
      </section>
      <MakerApplicationsPanel />
    </Container>
  );
}
