"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";

import { BRAND_MARK_SRC } from "@/components/public/hero-mark";
import { PROJECT_CATEGORIES } from "@/config/categories";
import { cn } from "@/lib/utils";

type HeroOrbitProps = {
  className?: string;
};

/**
 * Orbital studio map: categories circle a DekaByte core and tilt toward the pointer.
 * Distinct from the 3D cube — ring depth + upright typography nodes.
 */
export function HeroOrbit({ className }: HeroOrbitProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0, spin: 0 });
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
      const ease = 1 - Math.pow(0.9, dt);
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      if (!reducedRef.current) {
        current.current.spin += 0.22 * dt;
      }

      const { x, y, spin } = current.current;
      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotateX(${16 + y}deg) rotateY(${x}deg)`;
      }
      if (spinRef.current) {
        spinRef.current.style.transform = `rotateZ(${spin}deg)`;
      }
      for (const el of labelRefs.current) {
        if (el) el.style.transform = `rotateZ(${-spin}deg)`;
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
    target.current.x = nx * 18;
    target.current.y = -ny * 12;
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
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgb(219_234_254)_0%,rgb(245_246_248/0.35)_42%,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-[24%] rounded-full bg-[radial-gradient(circle,rgb(37_99_235/0.18)_0%,transparent_70%)] blur-2xl" />

      <div
        className="relative size-[min(72vw,20rem)] sm:size-[22rem]"
        style={{ perspective: "900px", perspectiveOrigin: "50% 45%" }}
      >
        <div
          ref={tiltRef}
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(16deg)",
            willChange: "transform",
          }}
        >
          <div
            className="absolute inset-[12%] rounded-full border border-electric/25"
            style={{ transform: "rotateX(76deg)" }}
          />
          <div
            className="absolute inset-[3%] rounded-full border border-dashed border-graphite/12"
            style={{ transform: "rotateX(76deg) translateZ(-8px)" }}
          />

          <div
            className="absolute top-1/2 left-1/2 flex size-[5.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/75 bg-gradient-to-br from-white via-[#f8fafc] to-[#e8eef8] p-2.5 shadow-[0_18px_40px_rgb(18_21_26/0.16)] sm:size-[6.5rem]"
            style={{ transform: "translateZ(36px)" }}
          >
            <Image
              src={BRAND_MARK_SRC}
              alt=""
              width={96}
              height={96}
              className="size-full object-contain"
              priority
            />
          </div>

          <div
            ref={spinRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            {PROJECT_CATEGORIES.map((cat, i) => {
              const angle = (360 / PROJECT_CATEGORIES.length) * i;
              return (
                <div
                  key={cat.id}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `rotateZ(${angle}deg) translateY(-7.75rem) translateZ(14px)`,
                  }}
                >
                  <div
                    ref={(el) => {
                      labelRefs.current[i] = el;
                    }}
                    className="-translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/65 bg-card/95 px-2.5 py-2 text-center shadow-[0_10px_28px_rgb(18_21_26/0.12)] backdrop-blur-sm sm:min-w-[4.5rem] sm:px-3"
                  >
                    <p className="font-mono text-[0.55rem] tracking-[0.18em] text-electric/75 uppercase">
                      0{i + 1}
                    </p>
                    <p className="text-display text-[0.85rem] leading-none font-semibold tracking-tight text-graphite sm:text-[0.95rem]">
                      {cat.short}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
