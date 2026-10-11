import { direction, pct } from "@/lib/format";

export default function ChangeBadge({ change }: { change: number }) {
  const d = direction(change);
  const style =
    d === "up" ? "bg-green-100 text-green-700" : d === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${style}`}>
      {d === "up" ? "▲" : d === "down" ? "▼" : "—"} {pct(change)}%
    </span>
  );
}
