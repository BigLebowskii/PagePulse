"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-pulse/20 animate-pulse-ring" />
                <span className="relative inline-flex h-5 w-5 rounded-full bg-pulse" />
              </span>
              <span className="text-xl font-heading font-bold text-slate-900">
                PagePulse
              </span>
            </a>
            <h1 className="text-2xl font-heading font-bold text-slate-900">
              Reset your password
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-50 mx-auto">
                <svg
                  className="h-7 w-7 text-success"
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
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Check your email
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                We sent a password reset link to{" "}
                <span className="font-medium text-slate-900">{email}</span>.
              </p>
              <a
                href="/login"
                className="mt-6 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                &larr; Back to login
              </a>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-center text-sm text-slate-500">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Sign in
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
