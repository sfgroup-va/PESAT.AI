"use client";

/**
 * Status bar diagnosis — menggantikan "3 dari 6" form counter.
 * Dibingkai sebagai proses diagnosis: "Membaca pola bisnis Anda", dll.
 *
 * Animasi fade-in di-handle via key-reset dari parent (key={currentStatus}),
 * sehingga komponen re-mount saat label berubah dan animasi replay otomatis.
 * Tidak perlu state/effect internal.
 */
export function AnalysisStatus({ label }: { label: string }) {
  return (
    <div className="border-b border-neutral-100 bg-white/60 px-5 py-2.5 backdrop-blur-sm">
      <div className="flex animate-fade-in items-center justify-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-300 opacity-75" />
          <span className="relative inline-flex h-full w-full rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
        </span>
        <span className="text-[11.5px] font-medium tracking-tight text-neutral-500">{label}</span>
      </div>
    </div>
  );
}
