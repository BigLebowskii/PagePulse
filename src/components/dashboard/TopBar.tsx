"use client";

interface TopBarProps {
  fullName: string;
  plan: string;
  onMenuToggle: () => void;
}

export default function TopBar({ fullName, plan, onMenuToggle }: TopBarProps) {
  const firstName = fullName?.split(" ")[0] || "there";
  const initial = (fullName?.[0] || "U").toUpperCase();

  const planColors: Record<string, string> = {
    free: "bg-gray-100 text-gray-700",
    starter: "bg-blue-100 text-blue-700",
    growth: "bg-primary-100 text-primary-700",
    agency: "bg-purple-100 text-purple-700",
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-100">
      {/* Left: hamburger + welcome */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-600 hover:bg-gray-50 rounded-lg"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-sm sm:text-base font-medium text-slate-700">
          Hey, <span className="font-semibold text-slate-900">{firstName}</span>!
        </h2>
      </div>

      {/* Right: plan badge + avatar */}
      <div className="flex items-center gap-3">
        <span
          className={`hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            planColors[plan] || planColors.free
          }`}
        >
          {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
          {initial}
        </div>
      </div>
    </header>
  );
}
