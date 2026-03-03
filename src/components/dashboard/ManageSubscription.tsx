// ============================================
// Manage Subscription Button
// Opens LemonSqueezy customer portal
// ============================================

"use client";

import { useState } from "react";

export default function ManageSubscription() {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/portal");
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No portal URL returned");
      }
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-60"
    >
      {loading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
