"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms for sequential sections */
  delayMs?: number;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll reveal via IntersectionObserver.
 * Reduced motion is handled in CSS (`.reveal-io` forced visible).
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal-io", visible && "is-visible", className)}
      style={
        delayMs
          ? { transitionDelay: visible ? `${delayMs}ms` : undefined }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
