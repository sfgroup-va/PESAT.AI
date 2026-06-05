"use client";

import { useEffect, useRef, ElementType, ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}

export function RevealOnScroll({
  children,
  delay = 0,
  as: Tag = "div",
  className = ""
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reveal = () => {
      if (delay > 0) {
        window.setTimeout(() => node.classList.add("in-view"), delay);
      } else {
        node.classList.add("in-view");
      }
    };

    // Fallback: no IntersectionObserver support
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    // If already in viewport on mount, reveal immediately
    const rect = node.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewportH && rect.bottom > 0) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  const Component = Tag as ElementType;
  return (
    <Component ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </Component>
  );
}

export default RevealOnScroll;
