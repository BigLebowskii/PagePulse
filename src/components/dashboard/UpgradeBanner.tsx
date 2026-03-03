// ============================================
// Upgrade Banner
// Shows when user is at or near their audit limit
// ============================================

"use client";

interface UpgradeBannerProps {
  auditsUsed: number;
  auditsLimit: number;
  plan: string;
}

export default function UpgradeBanner({ auditsUsed, auditsLimit, plan }: UpgradeBannerProps) {
  const isAtLimit = auditsUsed >= auditsLimit;
  const isNearLimit = auditsUsed >= auditsLimit - 1 && !isAtLimit;

  if (!isAtLimit && !isNearLimit) return null;

  // Don't show for agency (unlimited)
  if (plan === "agency") return null;

  return (
    <div
      className={`rounded-2xl border p-5 mb-6 ${
        isAtLimit
          ? "bg-red-50 border-red-200"
          : "bg-amber-50 border-amber-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full ${
            isAtLimit ? "bg-red-100" : "bg-amber-100"
          }`}
        >
          {isAtLimit ? (
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h4
            className={`text-sm font-semibold ${
              isAtLimit ? "text-red-800" : "text-amber-800"
            }`}
          >
            {isAtLimit
              ? "You've reached your monthly audit limit"
              : "You're almost at your monthly limit"}
          </h4>
          <p
            className={`mt-1 text-sm ${
              isAtLimit ? "text-red-600" : "text-amber-600"
            }`}
          >
            {isAtLimit
              ? `You've used all ${auditsLimit} audits on your ${plan} plan this month. Upgrade to run more audits.`
              : `You have ${auditsLimit - auditsUsed} audit${auditsLimit - auditsUsed === 1 ? "" : "s"} remaining this month.`}
          </p>
          {isAtLimit && (
            <a
              href="/dashboard/settings"
              className="mt-3 inline-flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              Upgrade Plan
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
