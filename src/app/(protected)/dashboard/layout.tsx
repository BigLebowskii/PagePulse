import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <DashboardShell
      fullName={profile?.full_name || user.email || "User"}
      plan={profile?.plan || "free"}
      auditsUsed={profile?.audits_used_this_month || 0}
      auditsLimit={profile?.audits_limit || 1}
    >
      {children}
    </DashboardShell>
  );
}
