"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";

import { PROJECT_CATEGORIES } from "@/config/categories";
import { cn } from "@/lib/utils";

export const BRAND_MARK_SRC = "/brand/mark.png";

type HeroMarkProps = {
  className?: string;
};

/**
 * Signature hero: the DekaByte mark with pointer parallax, breathing glow,
 * and orbiting category whispers — strong enough to stay as the default.
 */
export function HeroMark({ className }: HeroMarkProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0, pulse: 0 });
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reducedRef.current = mq.matches;
    };
    syncReduced();
    mq.addEventListener("change", syncReduced);

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const ease = 1 - Math.pow(0.86, dt);
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      if (!reducedRef.current) {
        current.current.pulse += 0.045 * dt;
      }

      const { x, y, pulse } = current.current;
      if (plateRef.current) {
        plateRef.current.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
      }
      if (glowRef.current) {
        const breath = 0.55 + Math.sin(pulse) * 0.18;
        glowRef.current.style.opacity = String(breath);
        glowRef.current.style.transform = `scale(${1.05 + Math.sin(pulse * 0.7) * 0.06})`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      mq.removeEventListener("change", syncReduced);
    };
  }, []);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedRef.current) return;
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    target.current.x = nx * 14;
    target.current.y = -ny * 10;
  }

  function onPointerLeave() {
    target.current.x = 0;
    target.current.y = 0;
  }

  return (
    <div
      ref={sceneRef}
      className={cn(
        "relative mx-auto flex aspect-square w-full max-w-md items-center justify-center select-none sm:max-w-lg",
        className,
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-[4%] rounded-[42%] bg-[radial-gradient(circle_at_48%_40%,rgb(219_234_254)_0%,rgb(239_246_255/0.55)_34%,transparent_68%)]" />
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgb(56_189_248/0.35)_0%,rgb(37_99_235/0.14)_42%,transparent_72%)] blur-2xl"
      />

      <ul className="pointer-events-none absolute inset-0">
        {PROJECT_CATEGORIES.map((cat, i) => {
          const angle =
            (Math.PI * 2 * i) / PROJECT_CATEGORIES.length - Math.PI / 2;
          const r = 42;
          const left = 50 + Math.cos(angle) * r;
          const top = 50 + Math.sin(angle) * r;
          return (
            <li
              key={cat.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 animate-fade-in"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${120 + i * 70}ms`,
              }}
            >
              <span className="rounded-full border border-white/50 bg-card/80 px-2 py-0.5 text-[0.62rem] font-medium tracking-wide text-slate/90 shadow-soft backdrop-blur-sm">
                {cat.short}
              </span>
            </li>
          );
        })}
      </ul>

      <div
        className="relative size-[min(62vw,17.5rem)] sm:size-[19rem]"
        style={{ perspective: "1000px", perspectiveOrigin: "50% 42%" }}
      >
        <div
          ref={plateRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div
            className="relative flex size-[78%] items-center justify-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-white/95 via-[#f8fafc]/90 to-[#e8eef8]/85 shadow-[0_28px_60px_rgb(18_21_26/0.16),inset_0_1px_0_rgb(255_255_255/0.9)]"
            style={{ transform: "translateZ(28px)" }}
          >
            <span className="absolute inset-3 rounded-[1.55rem] border border-electric/10" />
            <Image
              src={BRAND_MARK_SRC}
              alt=""
              width={220}
              height={220}
              className="relative z-[1] size-[72%] object-contain drop-shadow-[0_12px_28px_rgb(37_99_235/0.22)]"
              priority
            />
            <span className="hero-byte absolute top-[22%] left-[18%] size-2.5 rounded-[3px] bg-[#38bdf8] shadow-[0_0_12px_rgb(56_189_248/0.85)]" />
            <span className="hero-byte hero-byte-delay absolute top-[34%] left-[14%] size-2 rounded-[2px] bg-[#38bdf8]/90 shadow-[0_0_10px_rgb(56_189_248/0.7)]" />
            <span className="hero-byte hero-byte-delay-2 absolute top-[46%] left-[17%] size-1.5 rounded-[2px] bg-[#7dd3fc] shadow-[0_0_8px_rgb(125_211_252/0.75)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
