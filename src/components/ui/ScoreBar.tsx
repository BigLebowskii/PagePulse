export default function ScoreBar({ score, label }: { score: number; label?: string }) {
  const color =
    score >= 80
      ? "bg-success"
      : score >= 60
      ? "bg-amber-500"
      : "bg-pulse";

  const bgColor =
    score >= 80
      ? "bg-green-100"
      : score >= 60
      ? "bg-amber-100"
      : "bg-red-100";

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-slate-600">{label}</span>
          <span className="text-sm font-semibold text-slate-900">{score}/100</span>
        </div>
      )}
      <div className={`h-2 rounded-full ${bgColor}`}>
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(2, score)}%` }}
        />
      </div>
    </div>
  );
}
