"use client";

import { useState } from "react";
import styles from "./role.module.css";

type Role = "admin" | "seller" | "buyer";

const roles: Role[] = ["admin", "seller", "buyer"];

export default function DevRolePage() {
  const [selected, setSelected] = useState<Role>("buyer");
  const [status, setStatus] = useState<string>("");

  async function setRole(role: Role) {
    setSelected(role);
    setStatus("Setting role...");

    const res = await fetch("/api/dev/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      setStatus(`Role set to ${role}. Open a product page to test.`);
    } else {
      setStatus("Could not set role. Try again.");
    }
  }

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>Dev Role Switcher</h1>
      <p className={styles.sub}>
        Pick a role to test permissions on product pages.
      </p>

      <div className={styles.buttons}>
        {roles.map((role) => (
          <button
            key={role}
            className={`${styles.button} ${
              selected === role ? styles.active : ""
            }`}
            onClick={() => setRole(role)}
            type="button"
          >
            {role}
          </button>
        ))}
      </div>

      {status ? <p className={styles.status}>{status}</p> : null}
    </main>
  );
}
