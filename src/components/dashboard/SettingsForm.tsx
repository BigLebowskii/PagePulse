"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import ManageSubscription from "@/components/dashboard/ManageSubscription";

interface SettingsFormProps {
  profile: {
    full_name: string;
    email: string;
    plan: string;
    audits_used: number;
    audits_limit: number;
    subscription_status: string | null;
    lemonsqueezy_subscription_id: string | null;
  };
}

export default function SettingsForm({ profile }: SettingsFormProps) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    if (error) {
      toast("Failed to save changes.", "error");
    } else {
      toast("Settings saved!", "success");
    }
    setSaving(false);
  };

  const usagePercent = Math.min(100, (profile.audits_used / profile.audits_limit) * 100);
  const hasSubscription = !!profile.lemonsqueezy_subscription_id;

  return (
    <div className="mt-6 space-y-6">
      {/* Profile Section */}
      <div className="rounded-2xl bg-white border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-500 bg-gray-50"
            />
            <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Plan Section */}
      <div className="rounded-2xl bg-white border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Subscription</h2>

        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700 capitalize">
            {profile.plan} Plan
          </span>
          {profile.subscription_status && profile.subscription_status !== "none" && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                profile.subscription_status === "active"
                  ? "bg-green-50 text-green-700"
                  : profile.subscription_status === "cancelled"
                  ? "bg-amber-50 text-amber-700"
                  : profile.subscription_status === "past_due"
                  ? "bg-red-50 text-red-700"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              {profile.subscription_status}
            </span>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-600">Monthly usage</span>
            <span className="text-sm font-medium text-slate-900">
              {profile.audits_used}/{profile.audits_limit} audits
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full transition-all ${usagePercent >= 90 ? "bg-pulse" : "bg-primary-500"}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasSubscription ? (
            <ManageSubscription />
          ) : (
            <a
              href="/#pricing"
              className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Upgrade Plan
            </a>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl bg-white border border-red-200 p-6">
        <h2 className="text-base font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-slate-600 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {showDeleteConfirm ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                toast("Account deletion is not yet implemented.", "info");
                setShowDeleteConfirm(false);
              }}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Yes, Delete My Account
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}
