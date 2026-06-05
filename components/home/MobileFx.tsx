"use client";

/**
 * MobileFx — decorative, mobile-only animated backdrop.
 * Morphing aurora blobs + twinkling particle field.
 * pointer-events-none, hidden on lg+, disabled under prefers-reduced-motion (via CSS).
 * Drop as the FIRST child of a `relative` section; wrap real content with `relative z-10`.
 */
export function MobileFx({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden lg:hidden ${className}`}
    >
      <div className="fx-blob fx-blob-a" />
      <div className="fx-blob fx-blob-b" />
      <div className="fx-blob fx-blob-c" />
      <div className="fx-twinkle-field" />
    </div>
  );
}

export default MobileFx;
