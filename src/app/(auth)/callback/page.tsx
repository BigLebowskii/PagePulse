"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// This page handles OAuth callbacks (Google login) and
// email confirmation redirects from Supabase Auth.
// It exchanges the auth code for a session, then redirects.

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // Supabase Auth uses URL hash fragments for OAuth callbacks
      // The client library automatically picks up the tokens from the URL
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error.message);
        router.push("/login?error=auth_callback_failed");
        return;
      }

      // Success — redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-50 mb-4">
          <svg
            className="h-6 w-6 text-primary-500 animate-spin-slow"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
        <p className="text-sm text-slate-600">Completing sign in...</p>
      </div>
    </div>
  );
}
