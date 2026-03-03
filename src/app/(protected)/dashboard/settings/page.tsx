import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your account and subscription.</p>

      <SettingsForm
        profile={{
          full_name: profile?.full_name || "",
          email: user.email || "",
          plan: profile?.plan || "free",
          audits_used: profile?.audits_used_this_month || 0,
          audits_limit: profile?.audits_limit || 1,
          subscription_status: profile?.subscription_status || null,
          lemonsqueezy_subscription_id: profile?.lemonsqueezy_subscription_id || null,
          company_name: profile?.company_name || null,
          brand_color: profile?.brand_color || null,
        }}
      />
    </div>
  );
}
