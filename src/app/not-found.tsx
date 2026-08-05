import Link from "next/link";

import { Logo } from "@/components/public/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#dbeafe_0%,transparent_55%)]"
      />
      <div className="relative flex flex-col items-center">
        <Logo />
        <p className="mt-10 font-mono text-sm font-medium tracking-wider text-electric">
          404
        </p>
        <h1 className="text-display mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
          გვერდი ვერ მოიძებნა
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          ეს მისამართი არ არსებობს ან პროექტი აღარ არის გამოქვეყნებული.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" render={<Link href="/" />}>
            მთავარ გვერდზე
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/work" />}>
            ნამუშევრები
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/contact" />}>
            კონტაქტი
          </Button>
        </div>
      </div>
    </div>
  );
}
