import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Placeholder dashboard page — will be built out in Prompt 4.
// For now it just confirms auth is working.

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-6">
          <svg
            className="h-8 w-8 text-success"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">
          You&apos;re in! 🎉
        </h1>
        <p className="mt-2 text-slate-600">
          Logged in as{" "}
          <span className="font-medium text-slate-900">{user.email}</span>
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Dashboard will be built in the next step. Auth is working!
        </p>
        <form
          action="/api/auth/signout"
          method="POST"
          className="mt-8 inline-block"
        >
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
