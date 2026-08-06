"use client";

import { useEffect, useRef, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

const FACES = [
  { key: "front", label: "Web", rotate: "rotateY(0deg)" },
  { key: "back", label: "App", rotate: "rotateY(180deg)" },
  { key: "right", label: "CMS", rotate: "rotateY(90deg)" },
  { key: "left", label: "API", rotate: "rotateY(-90deg)" },
  { key: "top", label: "UI", rotate: "rotateX(90deg)" },
  { key: "bottom", label: "Data", rotate: "rotateX(-90deg)" },
] as const;

type HeroCubeProps = {
  className?: string;
};

/**
 * Ambient 3D studio mark: slow spin + pointer tilt (Resend-style presence,
 * DekaByte materials).
 */
export function HeroCube({ className }: HeroCubeProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0, spin: -28 });
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reducedRef.current = mq.matches;
    };
    syncReduced();
    mq.addEventListener("change", syncReduced);

    let frame = 0;
    const tick = () => {
      const ease = 0.075;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      if (!reducedRef.current) {
        current.current.spin += 0.12;
      }

      const cube = cubeRef.current;
      if (cube) {
        const { x, y, spin } = current.current;
        cube.style.transform = `rotateX(${12 + y}deg) rotateY(${spin + x}deg)`;
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
    target.current.x = nx * 22;
    target.current.y = -ny * 16;
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
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgb(219_234_254/0.95)_0%,rgb(245_246_248/0.35)_42%,transparent_68%)]" />
      <div className="pointer-events-none absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgb(29_78_216/0.12)_0%,transparent_70%)] blur-2xl" />

      <div
        className="relative"
        style={{
          perspective: "920px",
          perspectiveOrigin: "50% 45%",
        }}
      >
        <div
          ref={cubeRef}
          className="relative size-[min(52vw,14.5rem)] sm:size-[17rem] [--cube:min(26vw,7.25rem)] sm:[--cube:8.5rem]"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(12deg) rotateY(-28deg)",
            willChange: "transform",
          }}
        >
          {FACES.map((face) => (
            <div
              key={face.key}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-2 border border-white/35",
                "bg-[linear-gradient(145deg,rgb(255_255_255/0.92)_0%,rgb(219_234_254/0.88)_48%,rgb(226_232_240/0.9)_100%)]",
                "shadow-[inset_0_1px_0_rgb(255_255_255/0.65),0_12px_40px_rgb(18_21_26/0.12)]",
                "backdrop-blur-[2px]",
              )}
              style={{
                transform: `${face.rotate} translateZ(var(--cube))`,
                backfaceVisibility: "hidden",
              }}
            >
              <span className="font-mono text-[0.65rem] tracking-[0.22em] text-electric uppercase sm:text-xs">
                DekaByte
              </span>
              <span className="text-display text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">
                {face.label}
              </span>
              <span className="h-px w-10 bg-electric/35" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
