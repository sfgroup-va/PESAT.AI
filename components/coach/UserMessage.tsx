"use client";

export function UserMessage({ label }: { label: string }) {
  return (
    <div className="flex animate-fade-in-up justify-end">
      <div className="max-w-[88%] rounded-[1.4rem] rounded-br-md bg-gradient-to-br from-neutral-900 to-neutral-800 px-5 py-3 text-white shadow-lg shadow-neutral-900/20">
        <p className="text-[15px] font-medium leading-[1.55]">{label}</p>
      </div>
    </div>
  );
}
