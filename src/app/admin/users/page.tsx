import Container from "@/components/layout/Container";
import UserRoleManagerPanel from "@/components/admin/UserRoleManagerPanel";
import { requireAdminSession } from "@/lib/auth/adminAccess";
import styles from "../shared-admin.module.css";

export const metadata = {
  title: "Manage Users | Heritage Makers",
};

export default async function AdminUsersPage() {
  // Gate entire page on server so role-management UI is admin-only.
  const admin = await requireAdminSession();
  if (!admin) {
    return (
      <Container>
        <section className={styles.section}>
          <h1 className={styles.title}>Admin Access Required</h1>
          <p className={styles.subtitle}>
            You must be signed in as an admin to update user roles.
          </p>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className={styles.section}>
        <h1 className={styles.title}>User Roles</h1>
        <p className={styles.subtitle}>
          Any admin can upgrade users to admin, maker, or buyer access.
        </p>
      </section>
      <UserRoleManagerPanel />
    </Container>
  );
}
