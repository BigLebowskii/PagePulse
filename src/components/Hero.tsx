"use client";

import { useState } from "react";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    // Redirect to waitlist since the tool isn't built yet
    setTimeout(() => {
      setLoading(false);
      const waitlist = document.getElementById("waitlist");
      if (waitlist) waitlist.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pulse/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-sm text-primary-700 font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
          </span>
          Free SEO Health Check
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Check Your Website&apos;s{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
            Heartbeat
          </span>{" "}
          in 60 Seconds
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Get a free health check with actionable fixes. No signup required. No
          credit card. Just paste your URL.
        </p>

        {/* URL Input */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto"
        >
          <div className="relative flex-1 w-full">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your website URL..."
              className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto whitespace-nowrap rounded-xl bg-pulse px-8 py-4 text-base font-semibold text-white shadow-lg shadow-pulse/25 hover:bg-red-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin-slow h-5 w-5"
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
                Checking...
              </>
            ) : (
              <>Check My Pulse &rarr;</>
            )}
          </button>
        </form>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-success" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            6 Health Checks
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-success" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            PDF Report
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-success" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Plain-English Fixes
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-success" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Free First Scan
          </span>
        </div>
      </div>
    </section>
  );
}
