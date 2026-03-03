"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CHECK_NAMES = [
  "Checking broken links...",
  "Scanning image alt text...",
  "Testing page speed...",
  "Validating meta tags...",
  "Testing mobile friendliness...",
  "Analyzing heading structure...",
];

function NewAuditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [checkStates, setCheckStates] = useState<("pending" | "running" | "done")[]>(
    CHECK_NAMES.map(() => "pending")
  );
  const [checkScores, setCheckScores] = useState<(number | null)[]>(
    CHECK_NAMES.map(() => null)
  );

  // Auto-start if URL came from query param
  useEffect(() => {
    if (searchParams.get("url") && !running) {
      handleStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStart() {
    if (!url.trim()) return;
    setError("");
    setRunning(true);

    // Simulate progressive check updates
    const newStates = CHECK_NAMES.map(() => "pending" as const);
    setCheckStates(newStates);
    setCheckScores(CHECK_NAMES.map(() => null));

    // Animate checks one by one with delays
    for (let i = 0; i < CHECK_NAMES.length; i++) {
      setTimeout(() => {
        setCheckStates((prev) => {
          const next = [...prev];
          next[i] = "running";
          return next;
        });
      }, i * 800);
    }

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Audit failed.");
        setRunning(false);
        setCheckStates(CHECK_NAMES.map(() => "pending"));
        return;
      }

      // Mark all checks as done with scores
      const results = data.results;
      const scores = [
        results?.broken_links?.score ?? 0,
        results?.alt_text?.score ?? 0,
        results?.page_speed?.score ?? 0,
        results?.meta_tags?.score ?? 0,
        results?.mobile_friendly?.score ?? 0,
        results?.headings?.score ?? 0,
      ];
      setCheckScores(scores);
      setCheckStates(CHECK_NAMES.map(() => "done"));

      // Redirect to results after a brief pause
      setTimeout(() => {
        router.push(`/dashboard/audits/${data.id}`);
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setRunning(false);
      setCheckStates(CHECK_NAMES.map(() => "pending"));
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-slate-900">New Audit</h1>
      <p className="mt-1 text-sm text-slate-500">Enter a website URL to run a full health check.</p>

      {/* URL Input */}
      <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStart();
          }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Website URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={running}
              placeholder="https://example.com"
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-slate-500"
            />
            <button
              type="submit"
              disabled={running || !url.trim()}
              className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {running ? "Running..." : "Start Audit"}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </form>
      </div>

      {/* Progress */}
      {running && (
        <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Running Health Checks</h3>
          <p className="text-sm text-slate-500 mb-5">Usually takes 15–30 seconds</p>

          <div className="space-y-3">
            {CHECK_NAMES.map((name, i) => (
              <div key={i} className="flex items-center gap-3">
                {checkStates[i] === "done" ? (
                  <svg className="h-5 w-5 text-success flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : checkStates[i] === "running" ? (
                  <svg className="h-5 w-5 text-primary-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    checkStates[i] === "done"
                      ? "text-slate-900 font-medium"
                      : checkStates[i] === "running"
                      ? "text-primary-700 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  {checkStates[i] === "done" && checkScores[i] !== null
                    ? `${name.replace("...", "")} — Score: ${checkScores[i]}`
                    : name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewAuditPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
      <NewAuditContent />
    </Suspense>
  );
}
