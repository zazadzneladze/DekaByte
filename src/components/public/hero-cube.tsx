"use client";

import { useEffect, useRef, type PointerEvent } from "react";

import { PROJECT_CATEGORIES } from "@/config/categories";
import { cn } from "@/lib/utils";

const FACE_ROTATES = [
  "rotateY(0deg)",
  "rotateY(180deg)",
  "rotateY(90deg)",
  "rotateY(-90deg)",
  "rotateX(90deg)",
  "rotateX(-90deg)",
] as const;

const FACE_TINTS = [
  "from-muted-blue/90 via-muted to-secondary dark:from-primary/20 dark:via-card dark:to-secondary",
  "from-secondary via-muted-blue/80 to-card dark:from-card dark:via-secondary dark:to-background",
  "from-muted via-secondary to-muted-blue/70 dark:from-secondary dark:via-card dark:to-muted",
  "from-card via-muted to-secondary dark:from-background dark:via-card dark:to-secondary",
  "from-muted-blue/70 via-muted to-card dark:from-primary/15 dark:via-secondary dark:to-card",
  "from-secondary via-muted-blue/60 to-muted dark:from-card dark:via-muted dark:to-background",
] as const;

type HeroCubeProps = {
  className?: string;
};

/**
 * Tumbles on X+Y (not a flat carousel) and leans toward the pointer.
 * Six faces = six studio categories.
 */
export function HeroCube({ className }: HeroCubeProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0, ax: 18, ay: -32 });
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
        // Uneven rates → visible tumble instead of a flat turntable
        current.current.ay += 0.28 * dt;
        current.current.ax += 0.11 * dt;
      }

      const cube = cubeRef.current;
      if (cube) {
        const { x, y, ax, ay } = current.current;
        cube.style.transform = `rotateX(${ax + y}deg) rotateY(${ay + x}deg)`;
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
    target.current.x = nx * 28;
    target.current.y = -ny * 22;
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
      <div className="hero-scene-halo pointer-events-none absolute inset-[6%] rounded-[40%]" />
      <div className="hero-scene-accent hero-scene-blur pointer-events-none absolute inset-[20%] rounded-full" />

      <div
        className="relative"
        style={{
          perspective: "1100px",
          perspectiveOrigin: "50% 42%",
        }}
      >
        <div
          ref={cubeRef}
          className="relative size-[min(54vw,15rem)] sm:size-[17.5rem] [--cube:min(27vw,7.5rem)] sm:[--cube:8.75rem]"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(18deg) rotateY(-32deg)",
            willChange: "transform",
          }}
        >
          {PROJECT_CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-2.5 overflow-hidden border border-border/50",
                "bg-gradient-to-br shadow-[inset_0_1px_0_rgb(255_255_255/0.75),0_18px_48px_rgb(18_21_26/0.14)]",
                FACE_TINTS[i],
              )}
              style={{
                transform: `${FACE_ROTATES[i]} translateZ(var(--cube))`,
                backfaceVisibility: "hidden",
              }}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-white/70" />
              <span className="font-mono text-micro-sm tracking-[0.28em] text-electric/80 uppercase">
                0{i + 1}
              </span>
              <span className="text-display text-cube-face-title px-3 text-center leading-tight font-semibold tracking-tight text-foreground">
                {cat.short}
              </span>
              <span className="text-micro max-w-[85%] truncate px-2 text-center text-muted-foreground">
                {cat.label}
              </span>
              <span className="h-px w-8 bg-electric/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
