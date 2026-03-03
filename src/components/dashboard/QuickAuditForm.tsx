"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickAuditForm() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    router.push(`/dashboard/new-audit?url=${encodeURIComponent(url.trim())}`);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
      <h2 className="text-lg font-heading font-bold">Run a New Audit</h2>
      <p className="mt-1 text-sm text-primary-100">
        Paste any URL to check its health in seconds.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors whitespace-nowrap"
        >
          Scan &rarr;
        </button>
      </form>
    </div>
  );
}
