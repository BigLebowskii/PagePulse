export default function GradeBadge({ grade }: { grade: string }) {
  const colors: Record<string, string> = {
    A: "bg-green-100 text-green-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-amber-100 text-amber-700",
    D: "bg-orange-100 text-orange-700",
    F: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-bold ${
        colors[grade] || "bg-gray-100 text-gray-700"
      }`}
    >
      {grade}
    </span>
  );
}
