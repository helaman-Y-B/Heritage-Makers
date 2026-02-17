"use client";

import { useEffect, useState } from "react";
import styles from "./UserRoleManagerPanel.module.css";

type UserRow = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: "buyer" | "seller" | "admin";
};

const ROLE_OPTIONS: Array<UserRow["role"]> = ["buyer", "seller", "admin"];
const ROLE_SORT_WEIGHT: Record<UserRow["role"], number> = {
  admin: 0,
  seller: 1,
  buyer: 2,
};

function sortUsersByRole(users: UserRow[]): UserRow[] {
  // Keep list ordered by governance priority: admin -> seller (maker) -> buyer.
  return [...users].sort((a, b) => {
    const byRole = ROLE_SORT_WEIGHT[a.role] - ROLE_SORT_WEIGHT[b.role];
    if (byRole !== 0) return byRole;

    const byFirstName = a.firstname.localeCompare(b.firstname);
    if (byFirstName !== 0) return byFirstName;

    const byLastName = a.lastname.localeCompare(b.lastname);
    if (byLastName !== 0) return byLastName;

    return a.user_id - b.user_id;
  });
}

export default function UserRoleManagerPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<number | null>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      // no-store ensures role/delete actions from other admins are visible immediately.
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Failed to load users");
        return;
      }
      setUsers(sortUsersByRole(Array.isArray(data?.users) ? data.users : []));
      setCurrentAdminId(
        typeof data?.currentAdminId === "number" ? data.currentAdminId : null,
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function updateRole(userId: number, role: UserRow["role"]) {
    setBusyUserId(userId);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Failed to update role");
        return;
      }

      setUsers((previous) =>
        // Re-sort locally so row order updates instantly after role change.
        sortUsersByRole(previous.map((user) => (user.user_id === userId ? { ...user, role } : user))),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to update role");
    } finally {
      setBusyUserId(null);
    }
  }

  async function deleteUser(user: UserRow) {
    // UI confirmation guards accidental irreversible deletions.
    const confirmed = window.confirm(
      `Delete account for ${user.firstname} ${user.lastname} (${user.email})? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setBusyUserId(user.user_id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${user.user_id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Failed to delete user");
        return;
      }
      setUsers((previous) => previous.filter((row) => row.user_id !== user.user_id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to delete user");
    } finally {
      setBusyUserId(null);
    }
  }

  if (loading) return <p className={styles.message}>Loading users...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Update role</th>
            <th>Delete account</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = currentAdminId === user.user_id;
            const isAdmin = user.role === "admin";
            // Mirror server policy in UI: admin accounts and your own account are protected.
            const canDelete = !isSelf && !isAdmin;

            return (
              <tr key={user.user_id}>
                <td>{`${user.firstname} ${user.lastname}`.trim()}</td>
                <td>{user.email}</td>
                <td className={styles.role}>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    disabled={busyUserId === user.user_id}
                    onChange={(event) => {
                      const selectedRole = event.target.value as UserRow["role"];
                      void updateRole(user.user_id, selectedRole);
                    }}
                  >
                    {ROLE_OPTIONS.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    disabled={!canDelete || busyUserId === user.user_id}
                    onClick={() => void deleteUser(user)}
                  >
                    {isSelf ? "Your account" : isAdmin ? "Protected" : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
