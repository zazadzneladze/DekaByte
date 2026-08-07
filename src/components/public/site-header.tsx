"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LockIcon, MenuIcon } from "lucide-react";

import { Logo } from "@/components/public/logo";
import { HeroVisualToggle } from "@/components/public/hero-visual-toggle";
import { ModeToggle } from "@/components/mode-toggle";
import { UserAvatar } from "@/components/public/user-avatar";
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
  { href: "/about", label: "ჩვენს შესახებ" },
  { href: "/estimate", label: "ბიუჯეტი" },
  { href: "/contact", label: "კონტაქტი" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type HeaderAccount = {
  href: string;
  image: string | null;
  label: string;
} | null;

type SiteHeaderProps = {
  account?: HeaderAccount;
  logoSrc?: string | null;
};

export function SiteHeader({ account = null, logoSrc = null }: SiteHeaderProps) {
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
        "fixed inset-x-0 top-0 z-40 border-b border-transparent bg-background/75 backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300",
        scrolled && "border-border/80 bg-background/90 shadow-soft",
      )}
      style={{ height: "var(--header-height)" }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo href="/" size="sm" src={logoSrc} />

        <nav
          aria-label="მთავარი ნავიგაცია"
          className="hidden items-center gap-0.5 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-[0.8125rem] font-medium tracking-wide text-slate transition-colors hover:text-foreground",
                  active && "text-foreground",
                )}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-electric"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ModeToggle className="hidden sm:inline-flex" />
          <HeroVisualToggle />
          {account ? (
            <UserAvatar
              image={account.image}
              label={account.label}
              href={account.href}
              size={36}
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-slate hover:text-foreground"
              render={<Link href="/portal/login" />}
              aria-label="კლიენტის პანელი"
              title="კლიენტის პანელი"
            >
              <LockIcon aria-hidden="true" />
            </Button>
          )}

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
                <Logo href="/" size="sm" src={logoSrc} />
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
              <div className="mt-auto space-y-2 border-t border-border p-4">
              <div className="flex items-center justify-between gap-2 pb-1">
                    <p className="text-xs text-muted-foreground">თემა</p>
                    <ModeToggle />
                  </div>
                {pathname === "/" ? (
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <p className="text-xs text-muted-foreground">Hero ვიზუალი</p>
                    <HeroVisualToggle />
                  </div>
                ) : null}
                {account ? (
                  <Button
                    className="w-full"
                    render={
                      <Link
                        href={account.href}
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    ჩემი პანელი
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    render={
                      <Link
                        href="/portal/login"
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    <LockIcon aria-hidden="true" />
                    კლიენტის პანელი
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
