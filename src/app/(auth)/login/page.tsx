import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In — PagePulse",
  description: "Sign in to your PagePulse account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 px-4 py-12">
      <LoginForm />
    </div>
  );
}
