"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { ToastProvider } from "../ui/Toast";

interface DashboardShellProps {
  children: React.ReactNode;
  fullName: string;
  plan: string;
  auditsUsed: number;
  auditsLimit: number;
}

export default function DashboardShell({
  children,
  fullName,
  plan,
  auditsUsed,
  auditsLimit,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          plan={plan}
          auditsUsed={auditsUsed}
          auditsLimit={auditsLimit}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="lg:ml-64">
          <TopBar
            fullName={fullName}
            plan={plan}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
