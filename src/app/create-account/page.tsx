import AuthShell from "@/components/auth/AuthShell";
import CreateAccountForm from "@/components/auth/CreateAccountForm";

export default function CreateAccountPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Use Google to join Heritage Makers and start with a buyer account."
    >
      <CreateAccountForm />
    </AuthShell>
  );
}
