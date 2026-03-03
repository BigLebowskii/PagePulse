// Circular progress indicator for scores
export default function ScoreCircle({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    score >= 80
      ? "text-success stroke-success"
      : score >= 60
      ? "text-amber-500 stroke-amber-500"
      : "text-pulse stroke-pulse";

  const bgStroke =
    score >= 80
      ? "stroke-green-100"
      : score >= 60
      ? "stroke-amber-100"
      : "stroke-red-100";

  const dims = size === "lg" ? 120 : size === "md" ? 64 : 40;
  const strokeWidth = size === "lg" ? 8 : size === "md" ? 6 : 4;
  const radius = (dims - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const fontSize = size === "lg" ? "text-2xl" : size === "md" ? "text-sm" : "text-xs";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: dims, height: dims }}>
      <svg className="transform -rotate-90" width={dims} height={dims}>
        <circle
          className={bgStroke}
          cx={dims / 2}
          cy={dims / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className={color}
          cx={dims / 2}
          cy={dims / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className={`absolute font-bold ${fontSize} ${color.split(" ")[0]}`}>
        {score}
      </span>
    </div>
  );
}
