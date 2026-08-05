"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";

import { Logo } from "@/components/public/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "მთავარი" },
  { href: "/work", label: "ნამუშევრები" },
  { href: "/services", label: "მომსახურებები" },
  { href: "/estimate", label: "ბიუჯეტი" },
  { href: "/contact", label: "კონტაქტი" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPath, setOpenPath] = useState(pathname);

  if (openPath !== pathname) {
    setOpenPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-transparent bg-surface/85 backdrop-blur-md transition-[border-color,box-shadow] duration-200",
        scrolled && "border-border shadow-soft",
      )}
      style={{ height: "var(--header-height)" }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="მთავარი ნავიგაცია" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium text-slate transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-secondary text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            render={<Link href="/contact" />}
          >
            დაიწყე პროექტი
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="მენიუს გახსნა"
                />
              }
            >
              <MenuIcon aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,100%)] gap-0 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="sr-only">ნავიგაცია</SheetTitle>
                <Logo />
              </SheetHeader>
              <nav
                aria-label="მობილური ნავიგაცია"
                className="flex flex-col gap-1 p-3"
              >
                {NAV_ITEMS.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <SheetClose
                      key={item.href}
                      render={
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "rounded-lg px-3 py-2.5 text-base font-medium text-slate transition-colors hover:bg-secondary hover:text-foreground",
                            active && "bg-secondary text-foreground",
                          )}
                        />
                      }
                    >
                      {item.label}
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="mt-auto border-t border-border p-4">
                <Button
                  className="w-full"
                  render={<Link href="/contact" onClick={() => setOpen(false)} />}
                >
                  დაიწყე პროექტი
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
