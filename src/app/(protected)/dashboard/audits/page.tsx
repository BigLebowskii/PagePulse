import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ScoreCircle from "@/components/ui/ScoreCircle";
import GradeBadge from "@/components/ui/GradeBadge";

function gradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export default async function AuditsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: audits } = await supabase
    .from("audits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const allAudits = audits || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">My Audits</h1>
          <p className="mt-1 text-sm text-slate-500">{allAudits.length} total audits</p>
        </div>
        <a
          href="/dashboard/new-audit"
          className="rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
        >
          + New Audit
        </a>
      </div>

      {allAudits.length === 0 ? (
        <div className="rounded-2xl bg-white border border-gray-100 px-6 py-16 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 mb-4">
            <svg className="h-7 w-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-slate-900">No audits yet</h4>
          <p className="mt-1 text-sm text-slate-500">Run your first audit to get started!</p>
          <a href="/dashboard/new-audit" className="mt-4 inline-flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
            Run First Audit
          </a>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Website</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900 truncate max-w-[250px] block">
                        {audit.url.replace(/^https?:\/\//, "")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {audit.overall_score !== null ? <ScoreCircle score={audit.overall_score} size="sm" /> : <span className="text-sm text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      {audit.overall_score !== null ? <GradeBadge grade={gradeFromScore(audit.overall_score)} /> : <span className="text-sm text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${audit.status === "completed" ? "bg-green-50 text-green-700" : audit.status === "running" ? "bg-blue-50 text-blue-700" : audit.status === "failed" ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-700"}`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(audit.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {audit.status === "completed" && (
                        <a href={`/dashboard/audits/${audit.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                          View Report
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
