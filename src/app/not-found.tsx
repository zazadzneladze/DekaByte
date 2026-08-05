import Link from "next/link";

import { Logo } from "@/components/public/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <Logo />
      <p className="mt-8 text-sm font-medium text-electric">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        გვერდი ვერ მოიძებნა
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        ეს მისამართი არ არსებობს ან პროექტი აღარ არის გამოქვეყნებული.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/" />}>მთავარ გვერდზე</Button>
        <Button variant="outline" render={<Link href="/work" />}>
          ნამუშევრები
        </Button>
      </div>
    </div>
  );
}
