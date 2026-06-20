"use client";

export function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl bg-neutral-100 px-4 py-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "0ms" }} />
      <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "150ms" }} />
      <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
