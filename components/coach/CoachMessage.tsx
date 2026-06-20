"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function CoachMessage({ text, typewriter = true }: { text: string; typewriter?: boolean }) {
  const [displayed, setDisplayed] = useState(typewriter ? "" : text);

  useEffect(() => {
    if (!typewriter) return;
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text, typewriter]);

  return (
    <div className="flex max-w-[92%] gap-3 sm:max-w-[85%]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="rounded-[1.35rem] rounded-tl-md border border-violet-100 bg-white px-5 py-4 shadow-sm">
        <p className="text-base leading-7 text-neutral-800">{displayed}</p>
      </div>
    </div>
  );
}
