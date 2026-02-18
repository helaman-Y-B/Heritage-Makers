import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with Google to manage your account and access member features."
    >
      <Suspense fallback={<p>Loading login...</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
