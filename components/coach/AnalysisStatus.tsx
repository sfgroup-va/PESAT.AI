"use client";

export function AnalysisStatus({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">{label}</span>
    </div>
  );
}
