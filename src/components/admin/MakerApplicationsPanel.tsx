"use client";

import { useEffect, useState } from "react";
import styles from "./MakerApplicationsPanel.module.css";

type Application = {
  application_id: number;
  user_id: number;
  studio_name: string;
  craft_type: string;
  story: string;
  shop_link: string | null;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
  review_note: string | null;
  firstname: string;
  lastname: string;
  email: string;
};

export default function MakerApplicationsPanel() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function loadApplications() {
    setLoading(true);
    setError(null);
    try {
      // Always fetch fresh queue data so admins see latest review state.
      const response = await fetch("/api/admin/maker-applications", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Failed to load applications");
        return;
      }
      setApplications(Array.isArray(data?.applications) ? data.applications : []);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load applications",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadApplications();
  }, []);

  async function review(applicationId: number, decision: "approve" | "reject") {
    setBusyId(applicationId);
    setError(null);
    try {
      // Decision is processed server-side (transaction + role update on approval).
      const response = await fetch(`/api/admin/maker-applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Failed to update application");
        return;
      }
      await loadApplications();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Failed to update application",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className={styles.message}>Loading maker applications...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (applications.length === 0) {
    return <p className={styles.message}>No maker applications yet.</p>;
  }

  return (
    <div className={styles.list}>
      {applications.map((application) => {
        const applicantName = `${application.firstname} ${application.lastname}`.trim();
        const isPending = application.status === "pending";

        return (
          <article key={application.application_id} className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>{application.studio_name}</h2>
                <p className={styles.meta}>
                  Applicant: {applicantName} ({application.email})
                </p>
              </div>
              <span className={styles.status}>{application.status}</span>
            </header>

            <p className={styles.meta}>Craft type: {application.craft_type}</p>
            <p className={styles.story}>{application.story}</p>
            {application.shop_link ? (
              <p className={styles.meta}>
                Portfolio:{" "}
                <a href={application.shop_link} target="_blank" rel="noreferrer">
                  {application.shop_link}
                </a>
              </p>
            ) : null}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.approve}
                disabled={!isPending || busyId === application.application_id}
                onClick={() => review(application.application_id, "approve")}
              >
                Approve and upgrade to maker
              </button>
              <button
                type="button"
                className={styles.reject}
                disabled={!isPending || busyId === application.application_id}
                onClick={() => review(application.application_id, "reject")}
              >
                Reject application
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
