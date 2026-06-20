"use client";

export function UserMessage({ label }: { label: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[90%] rounded-[1.35rem] rounded-tr-md bg-neutral-950 px-5 py-3.5 text-white shadow-sm">
        <p className="text-base font-medium leading-6">{label}</p>
      </div>
    </div>
  );
}
