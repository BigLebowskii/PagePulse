import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up — PagePulse",
  description: "Create your free PagePulse account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 px-4 py-12">
      <SignupForm />
    </div>
  );
}
