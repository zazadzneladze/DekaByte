"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type AdminNotificationThread = {
  projectId: string;
  projectTitle: string;
  clientEmail: string;
  lastBody: string;
  unreadCount: number;
};

export type AdminNotificationLead = {
  id: string;
  name: string;
  projectType: string;
};

type Props = {
  totalCount: number;
  unreadMessages: number;
  newLeads: number;
  threads: AdminNotificationThread[];
  leads: AdminNotificationLead[];
};

export function AdminNotificationsSheet({
  totalCount,
  unreadMessages,
  newLeads,
  threads,
  leads,
}: Props) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            className="relative shrink-0"
            aria-label="შეტყობინებები"
          />
        }
      >
        <Bell className="size-4" />
        {totalCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>შეტყობინებები</SheetTitle>
          <SheetDescription>
            {unreadMessages} ჩატი · {newLeads} ახალი ლიდი
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-6 overflow-y-auto">
          <section className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">პორტალის ჩატი</h3>
              <Button
                variant="link"
                size="sm"
                className="h-auto px-0"
                render={<Link href="/admin/messages" />}
              >
                ყველა
              </Button>
            </div>
            {threads.length === 0 ? (
              <p className="text-sm text-muted-foreground">წაუკითხავი ჩატი არ არის</p>
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border/80">
                {threads.map((t) => (
                  <li key={t.projectId}>
                    <Link
                      href={`/admin/clients/${t.projectId}#chat`}
                      className="block px-3 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{t.projectTitle}</p>
                        {t.unreadCount > 0 ? (
                          <Badge className="shrink-0">{t.unreadCount}</Badge>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.lastBody}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">ახალი ლიდები</h3>
              <Button
                variant="link"
                size="sm"
                className="h-auto px-0"
                render={<Link href="/admin/leads?status=new" />}
              >
                ყველა
              </Button>
            </div>
            {leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">ახალი ლიდი არ არის</p>
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border/80">
                {leads.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="block px-3 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.projectType}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
