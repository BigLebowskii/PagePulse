import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ScoreCircle from "@/components/ui/ScoreCircle";
import GradeBadge from "@/components/ui/GradeBadge";
import ScoreBar from "@/components/ui/ScoreBar";

function gradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-amber-500";
  return "text-pulse";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-green-50 border-green-100";
  if (score >= 60) return "bg-amber-50 border-amber-100";
  return "bg-red-50 border-red-100";
}

export default async function AuditDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: audit } = await supabase
    .from("audits")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!audit) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = (audit.results as any) || {};
  const bl = r.broken_links || {};
  const at = r.alt_text || {};
  const ps = r.page_speed || {};
  const mt = r.meta_tags || {};
  const mf = r.mobile_friendly || {};
  const hd = r.headings || {};

  const grade = audit.overall_score !== null ? gradeFromScore(audit.overall_score) : "—";

  const checks = [
    { key: "broken_links", label: "Broken Links", score: bl.score ?? 0, summary: bl.broken_count > 0 ? `${bl.broken_count} broken out of ${bl.total_links} links` : `All ${bl.total_links || 0} links working` },
    { key: "alt_text", label: "Image Alt Text", score: at.score ?? 0, summary: at.missing_alt > 0 ? `${at.missing_alt} images missing alt text` : `All ${at.total_images || 0} images have alt text` },
    { key: "page_speed", label: "Page Speed", score: ps.score ?? 0, summary: ps.load_time_ms ? `${(ps.load_time_ms / 1000).toFixed(1)}s load time` : "Speed data unavailable" },
    { key: "meta_tags", label: "Meta Tags", score: mt.score ?? 0, summary: mt.missing_tags?.length > 0 ? `${mt.missing_tags.length} tags missing` : "All meta tags present" },
    { key: "mobile_friendly", label: "Mobile Friendly", score: mf.score ?? 0, summary: mf.is_responsive ? "Site is responsive" : "Responsiveness issues found" },
    { key: "headings", label: "Heading Structure", score: hd.score ?? 0, summary: hd.issues?.length > 0 ? `${hd.issues.length} issues found` : "Heading structure is good" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl bg-white border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <ScoreCircle score={audit.overall_score ?? 0} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-heading font-bold text-slate-900 break-all">
                {audit.url.replace(/^https?:\/\//, "")}
              </h1>
              <a href={audit.url} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <GradeBadge grade={grade} />
              <span className="text-sm text-slate-500">
                Audited {new Date(audit.created_at).toLocaleDateString()} at {new Date(audit.created_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-4 flex gap-3 flex-wrap">
              <a href={`/dashboard/new-audit?url=${encodeURIComponent(audit.url)}`} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
                Re-run Audit
              </a>
              <button disabled className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed">
                Download PDF (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.map((check) => (
          <a key={check.key} href={`#${check.key}`} className={`rounded-2xl border p-4 transition-shadow hover:shadow-md ${scoreBg(check.score)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900">{check.label}</h3>
              <span className={`text-lg font-bold ${scoreColor(check.score)}`}>{check.score}</span>
            </div>
            <ScoreBar score={check.score} />
            <p className="mt-2 text-xs text-slate-600">{check.summary}</p>
          </a>
        ))}
      </div>

      {/* ===== DETAILED SECTIONS ===== */}

      {/* Broken Links */}
      <section id="broken_links" className="rounded-2xl bg-white border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">🔗</span>
          <h2 className="text-lg font-semibold text-slate-900">Broken Links</h2>
          <span className={`ml-auto text-sm font-bold ${scoreColor(bl.score ?? 0)}`}>{bl.score ?? 0}/100</span>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          We found {bl.broken_count || 0} broken links out of {bl.total_links || 0} total links on your page.
        </p>
        {bl.broken_links?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left text-xs font-medium text-slate-500 uppercase"><th className="px-4 py-2">Broken URL</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Found On</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {bl.broken_links.map((link: { url: string; status_code: number; found_on: string }, i: number) => (
                    <tr key={i}><td className="px-4 py-2 text-red-600 break-all max-w-[300px]">{link.url}</td><td className="px-4 py-2">{link.status_code || "Timeout"}</td><td className="px-4 py-2 text-slate-500">{link.found_on}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">How to fix:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                {bl.broken_links.map((link: { url: string; status_code: number }, i: number) => (
                  <li key={i}>
                    {link.status_code === 404
                      ? `Update or remove the link to ${link.url.slice(0, 60)}`
                      : link.status_code === 0
                      ? `Check if ${link.url.slice(0, 60)} is still online`
                      : `Investigate the ${link.status_code} error on ${link.url.slice(0, 60)}`}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl text-sm text-green-700">✅ No broken links found! All links are working.</div>
        )}
      </section>

      {/* Alt Text */}
      <section id="alt_text" className="rounded-2xl bg-white border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">🖼️</span>
          <h2 className="text-lg font-semibold text-slate-900">Image Alt Text</h2>
          <span className={`ml-auto text-sm font-bold ${scoreColor(at.score ?? 0)}`}>{at.score ?? 0}/100</span>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          We found {at.missing_alt || 0} images missing alt text out of {at.total_images || 0} total images.
        </p>
        {at.images?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left text-xs font-medium text-slate-500 uppercase"><th className="px-4 py-2">Image Source</th><th className="px-4 py-2">Has Alt?</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {at.images.map((img: { src: string; has_alt: boolean }, i: number) => (
                    <tr key={i}><td className="px-4 py-2 text-slate-700 break-all max-w-[400px]">{img.src}</td><td className="px-4 py-2">{img.has_alt ? <span className="text-success">Yes</span> : <span className="text-pulse">No</span>}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">How to fix:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Add descriptive alt attributes to all images</li>
                <li>Alt text should describe what the image shows</li>
                <li>Keep alt text concise (under 125 characters)</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl text-sm text-green-700">✅ All images have alt text!</div>
        )}
      </section>

      {/* Page Speed */}
      <section id="page_speed" className="rounded-2xl bg-white border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">⚡</span>
          <h2 className="text-lg font-semibold text-slate-900">Page Speed</h2>
          <span className={`ml-auto text-sm font-bold ${scoreColor(ps.score ?? 0)}`}>{ps.score ?? 0}/100</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-slate-500">Load Time</p>
            <p className="text-lg font-bold text-slate-900">{ps.load_time_ms ? `${(ps.load_time_ms / 1000).toFixed(1)}s` : "—"}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-slate-500">First Contentful Paint</p>
            <p className="text-lg font-bold text-slate-900">{ps.first_contentful_paint ? `${(ps.first_contentful_paint / 1000).toFixed(1)}s` : "—"}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-slate-500">Largest Contentful Paint</p>
            <p className="text-lg font-bold text-slate-900">{ps.largest_contentful_paint ? `${(ps.largest_contentful_paint / 1000).toFixed(1)}s` : "—"}</p>
          </div>
        </div>
        {ps.recommendations?.length > 0 ? (
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Recommendations:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              {ps.recommendations.map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl text-sm text-green-700">✅ Page speed is excellent!</div>
        )}
      </section>

      {/* Meta Tags */}
      <section id="meta_tags" className="rounded-2xl bg-white border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">🏷️</span>
          <h2 className="text-lg font-semibold text-slate-900">Meta Tags</h2>
          <span className={`ml-auto text-sm font-bold ${scoreColor(mt.score ?? 0)}`}>{mt.score ?? 0}/100</span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            {mt.has_title ? <span className="text-success">✓</span> : <span className="text-pulse">✗</span>}
            <span className="text-slate-700">Title tag {mt.has_title ? `(${mt.title_length} chars)` : "(missing)"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {mt.has_description ? <span className="text-success">✓</span> : <span className="text-pulse">✗</span>}
            <span className="text-slate-700">Meta description {mt.has_description ? `(${mt.description_length} chars)` : "(missing)"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {mt.has_og_tags ? <span className="text-success">✓</span> : <span className="text-pulse">✗</span>}
            <span className="text-slate-700">Open Graph tags</span>
          </div>
        </div>
        {mt.missing_tags?.length > 0 ? (
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Missing tags to add:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              {mt.missing_tags.map((tag: string, i: number) => (
                <li key={i}>Add <code className="bg-blue-100 px-1 rounded">&lt;{tag}&gt;</code> tag</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl text-sm text-green-700">✅ All meta tags are present!</div>
        )}
      </section>

      {/* Mobile Friendly */}
      <section id="mobile_friendly" className="rounded-2xl bg-white border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">📱</span>
          <h2 className="text-lg font-semibold text-slate-900">Mobile Friendly</h2>
          <span className={`ml-auto text-sm font-bold ${scoreColor(mf.score ?? 0)}`}>{mf.score ?? 0}/100</span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            {mf.viewport_set ? <span className="text-success">✓</span> : <span className="text-pulse">✗</span>}
            <span className="text-slate-700">Viewport meta tag {mf.viewport_set ? "present" : "missing"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {mf.is_responsive ? <span className="text-success">✓</span> : <span className="text-pulse">✗</span>}
            <span className="text-slate-700">{mf.is_responsive ? "Site appears responsive" : "Responsiveness issues detected"}</span>
          </div>
        </div>
        {mf.issues?.length > 0 ? (
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Issues found:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              {mf.issues.map((issue: string, i: number) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl text-sm text-green-700">✅ Site is mobile-friendly!</div>
        )}
      </section>

      {/* Headings */}
      <section id="headings" className="rounded-2xl bg-white border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">📑</span>
          <h2 className="text-lg font-semibold text-slate-900">Heading Structure</h2>
          <span className={`ml-auto text-sm font-bold ${scoreColor(hd.score ?? 0)}`}>{hd.score ?? 0}/100</span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            {hd.has_h1 && hd.h1_count === 1 ? <span className="text-success">✓</span> : <span className="text-pulse">✗</span>}
            <span className="text-slate-700">H1 tag: {hd.h1_count || 0} found {hd.h1_count === 1 ? "(good)" : hd.h1_count > 1 ? "(should be exactly 1)" : "(missing)"}</span>
          </div>
        </div>
        {hd.structure?.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-slate-500 mb-2">Heading hierarchy:</p>
            <div className="space-y-0.5">
              {hd.structure.map((heading: string, i: number) => {
                const level = parseInt(heading.charAt(1)) || 1;
                return (
                  <p key={i} className="text-sm text-slate-700" style={{ paddingLeft: `${(level - 1) * 16}px` }}>
                    <span className="font-mono text-xs text-slate-400">{heading.split(":")[0]}:</span>{" "}
                    {heading.split(":").slice(1).join(":")}
                  </p>
                );
              })}
            </div>
          </div>
        )}
        {hd.issues?.length > 0 ? (
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Issues to fix:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              {hd.issues.map((issue: string, i: number) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl text-sm text-green-700">✅ Heading structure looks great!</div>
        )}
      </section>
    </div>
  );
}
