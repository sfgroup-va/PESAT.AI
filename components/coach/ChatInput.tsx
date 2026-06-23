"use client";

import { forwardRef, useState } from "react";
import { Send } from "lucide-react";

export type ChatInputProps = {
  placeholder: string;
  onSend: (value: string) => void;
  disabled?: boolean;
  submitLabel?: string;
};

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  function ChatInput({ placeholder, onSend, disabled, submitLabel }, ref) {
    const [value, setValue] = useState("");

    function handleSubmit(event?: React.FormEvent) {
      event?.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setValue("");
    }

    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-3 shadow-sm">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-10 items-center justify-center rounded-full bg-neutral-950 px-4 text-white transition hover:bg-black disabled:bg-neutral-300"
        >
          {submitLabel ? (
            <span className="text-sm font-bold">{submitLabel}</span>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    );
  }
);
