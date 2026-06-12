"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/home/ThemeToggle";
import { navLinks } from "@/components/home/data";

export function Header({ onStartWizard }: { onStartWizard?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      setScrolled(top > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, top / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-border-base bg-surface/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Pesat.AI logo.png"
              alt="Pesat.AI"
              width={500}
              height={422}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground-muted transition hover:bg-surface-subtle hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => onStartWizard?.()}
              className="hidden items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-surface transition hover:-translate-y-0.5 sm:inline-flex"
            >
              Buktikan Sendiri
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-border-base text-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="fixed inset-0 top-16 z-40 bg-surface px-5 py-6 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-4 text-lg font-semibold text-foreground transition hover:bg-surface-subtle"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onStartWizard?.();
            }}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-base font-semibold text-surface"
          >
            Buktikan Sendiri dalam 5 Menit
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      {/* Scroll progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent">
        <div
          className="scroll-progress h-full w-full"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </header>
  );
}

export default Header;
