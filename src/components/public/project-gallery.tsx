"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

import { MacBrowserFrame } from "@/components/public/mac-browser-frame";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
};

type ProjectGalleryProps = {
  images: GalleryImage[];
  projectTitle: string;
};

export function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const current = images[index];

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (images.length === 0) return;
      setIndex((prev) => (prev + delta + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  if (images.length === 0) return null;

  return (
    <>
      <section>
        <p className="mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-electric uppercase">
          გალერეა
        </p>
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-foreground">
          ეკრანები
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2">
          {images.map((image, i) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => openAt(i)}
                className="group flex w-full flex-col gap-2 text-left"
              >
                <MacBrowserFrame title={projectTitle}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                    <Image
                      src={image.url}
                      alt={image.alt || projectTitle}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                </MacBrowserFrame>
                {image.caption ? (
                  <p className="text-sm text-muted-foreground">{image.caption}</p>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[95vh] w-[min(96vw,72rem)] max-w-none gap-0 overflow-hidden border-0 bg-ink p-0 text-surface shadow-lift sm:max-w-none"
        >
          <DialogTitle className="sr-only">
            {current?.alt || projectTitle} — გალერეა
          </DialogTitle>

          <div className="relative flex min-h-[50vh] flex-col">
            <div className="absolute top-3 right-3 z-20 flex gap-2">
              <DialogClose
                render={
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-white/20 bg-ink/60 text-surface hover:bg-white/10 hover:text-surface"
                    aria-label="დახურვა"
                  />
                }
              >
                <XIcon />
              </DialogClose>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-14">
              {images.length > 1 ? (
                <>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="absolute left-2 z-10 border-white/20 bg-ink/60 text-surface hover:bg-white/10 hover:text-surface sm:left-4"
                    aria-label="წინა სურათი"
                    onClick={() => go(-1)}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="absolute right-2 z-10 border-white/20 bg-ink/60 text-surface hover:bg-white/10 hover:text-surface sm:right-4"
                    aria-label="შემდეგი სურათი"
                    onClick={() => go(1)}
                  >
                    <ChevronRightIcon />
                  </Button>
                </>
              ) : null}

              {current ? (
                <MacBrowserFrame
                  title={projectTitle}
                  className="w-full max-w-5xl"
                >
                  <div className="relative aspect-[16/10] w-full bg-black">
                    <Image
                      src={current.url}
                      alt={current.alt || projectTitle}
                      fill
                      className="object-contain"
                      sizes="96vw"
                      priority
                    />
                  </div>
                </MacBrowserFrame>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3 text-sm text-ink-muted sm:px-6">
              <p className="truncate text-surface/90">
                {current?.caption || current?.alt || projectTitle}
              </p>
              <p className={cn("shrink-0 font-mono text-xs")}>
                {index + 1} / {images.length}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
