"use client";

export function InsightRail({ insights }: { insights: string[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="rounded-[1.35rem] border border-violet-100 bg-violet-50/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-500">Yang mulai terlihat</p>
      <ul className="mt-2 space-y-1.5">
        {insights.map((insight, index) => (
          <li key={`${insight}-${index}`} className="flex items-start gap-2 text-sm font-medium text-violet-800">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
