import AuthShell from "@/components/auth/AuthShell";
import CreateAccountForm from "@/components/auth/CreateAccountForm";

export default function CreateAccountPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Heritage Makers to save favorites, manage orders, and more."
    >
      <CreateAccountForm />
    </AuthShell>
  );
}
