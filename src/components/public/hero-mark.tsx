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
 * Signature hero: DekaByte mark on a glass pedestal, studio categories on a
 * slow orbital ring — parallax tilt, breathing glow, counter-rotated labels.
 */
export function HeroMark({ className }: HeroMarkProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLUListElement>(null);
  const pedestalRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0, spin: 0, pulse: 0, float: 0 });
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
      const ease = 1 - Math.pow(0.88, dt);
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      if (!reducedRef.current) {
        current.current.spin += 0.16 * dt;
        current.current.pulse += 0.042 * dt;
        current.current.float += 0.038 * dt;
      }

      const { x, y, spin, pulse, float } = current.current;

      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotateX(${12 + y}deg) rotateY(${x}deg)`;
      }
      if (orbitRef.current) {
        orbitRef.current.style.transform = `rotateZ(${spin}deg)`;
      }
      for (const el of labelRefs.current) {
        if (el) el.style.transform = `rotateZ(${-spin}deg)`;
      }
      if (pedestalRef.current) {
        const bob = Math.sin(float) * 5;
        pedestalRef.current.style.transform = `translate(-50%, -50%) translateZ(56px) translateY(${bob}px)`;
      }
      if (glowRef.current) {
        const breath = 0.5 + Math.sin(pulse) * 0.2;
        glowRef.current.style.opacity = String(breath);
        glowRef.current.style.transform = `scale(${1.04 + Math.sin(pulse * 0.75) * 0.05})`;
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
    target.current.x = nx * 16;
    target.current.y = -ny * 11;
  }

  function onPointerLeave() {
    target.current.x = 0;
    target.current.y = 0;
  }

  return (
    <div
      ref={sceneRef}
      className={cn(
        "hero-mark-scene relative mx-auto flex aspect-square w-full max-w-md items-center justify-center select-none sm:max-w-lg",
        className,
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="hero-scene-halo pointer-events-none absolute inset-[2%] rounded-[44%]" />
      <div
        ref={glowRef}
        className="hero-scene-accent hero-scene-blur pointer-events-none absolute inset-[14%] rounded-full"
      />
      <div className="hero-mark-rays pointer-events-none absolute inset-[8%]" />

      <div
        className="relative size-[min(74vw,20.5rem)] sm:size-[22.5rem]"
        style={{ perspective: "980px", perspectiveOrigin: "50% 44%" }}
      >
        <div
          ref={tiltRef}
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(12deg)",
            willChange: "transform",
          }}
        >
          <div
            className="hero-mark-ring hero-mark-ring-outer absolute inset-[10%]"
            style={{ transform: "rotateX(74deg)" }}
          />
          <div
            className="hero-mark-ring hero-mark-ring-inner absolute inset-[4%]"
            style={{ transform: "rotateX(74deg) translateZ(-10px)" }}
          />

          <ul
            ref={orbitRef}
            className="absolute inset-0 m-0 list-none p-0"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            {PROJECT_CATEGORIES.map((cat, i) => {
              const angle = (360 / PROJECT_CATEGORIES.length) * i;
              return (
                <li
                  key={cat.id}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `rotateZ(${angle}deg) translateY(calc(-1 * var(--hero-mark-orbit))) translateZ(18px)`,
                  }}
                >
                  <div
                    ref={(el) => {
                      labelRefs.current[i] = el;
                    }}
                    className="hero-mark-node -translate-x-1/2 -translate-y-1/2"
                  >
                    <span className="hero-mark-node-index font-mono uppercase">
                      0{i + 1}
                    </span>
                    <span className="hero-mark-node-label text-display font-semibold tracking-tight">
                      {cat.short}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div
            ref={pedestalRef}
            className="hero-mark-pedestal absolute top-1/2 left-1/2"
            style={{ willChange: "transform" }}
          >
            <div className="hero-mark-plate relative flex size-[min(46vw,11.75rem)] items-center justify-center sm:size-[12.75rem]">
              <span className="hero-mark-plate-shine pointer-events-none absolute inset-0 rounded-[1.85rem]" />
              <span className="hero-mark-plate-rim pointer-events-none absolute inset-[5px] rounded-[1.65rem]" />
              <Image
                src={BRAND_MARK_SRC}
                alt=""
                width={240}
                height={240}
                className="hero-mark-image relative z-[1] size-[76%] object-contain"
                priority
              />
            </div>
            <div className="hero-mark-ground pointer-events-none absolute top-full left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
