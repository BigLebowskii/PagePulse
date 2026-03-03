"use client";

import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="py-20 sm:py-28 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pulse/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
          Get Early Access &mdash; 50% Off Forever
        </h2>
        <p className="mt-4 text-lg text-primary-100">
          We&apos;re launching soon. Join the waitlist and lock in founding
          member pricing.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-success/20 mx-auto">
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
            <h3 className="mt-4 text-xl font-semibold text-white">
              You&apos;re on the list!
            </h3>
            <p className="mt-2 text-primary-100">
              We&apos;ll let you know as soon as PagePulse is ready.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <div className="flex-1 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 py-3.5 px-4 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              {error && (
                <p className="mt-1 text-left text-sm text-red-300">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto whitespace-nowrap rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors shadow-lg"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-primary-200 flex items-center justify-center gap-1.5">
          <span className="text-pulse">&hearts;</span> 147 websites already
          checked their pulse
        </p>
      </div>
    </section>
  );
}
