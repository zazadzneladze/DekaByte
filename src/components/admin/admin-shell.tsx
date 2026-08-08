"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import {
  AdminNotificationsSheet,
  type AdminNotificationLead,
  type AdminNotificationThread,
} from "@/components/admin/admin-notifications-sheet";
import { AdminPushControls } from "@/components/admin/push-controls";
import { DEFAULT_LOGO_SRC } from "@/components/public/logo";
import { UserAvatar } from "@/components/public/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NAV: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badgeKey?: "messages" | "leads";
}> = [
  { href: "/admin", label: "დაფა", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "პორტფოლიო", icon: Briefcase },
  { href: "/admin/clients", label: "კლიენტები", icon: Users },
  {
    href: "/admin/messages",
    label: "შეტყობინებები",
    icon: MessageSquare,
    badgeKey: "messages",
  },
  { href: "/admin/leads", label: "ლიდები", icon: Inbox, badgeKey: "leads" },
  { href: "/admin/settings", label: "პარამეტრები", icon: Settings },
];

type Props = {
  children: React.ReactNode;
  logoUrl: string | null;
  userLabel: string;
  userImage: string | null | undefined;
  inboxCount: number;
  unreadMessages: number;
  newLeads: number;
  notificationThreads: AdminNotificationThread[];
  notificationLeads: AdminNotificationLead[];
  vapidPublicKey: string | null;
  signOutButton: React.ReactNode;
};

function pageTitle(pathname: string) {
  if (pathname === "/admin") return "დაფა";
  if (pathname.startsWith("/admin/projects")) return "პორტფოლიო";
  if (pathname.startsWith("/admin/clients")) return "კლიენტები";
  if (pathname.startsWith("/admin/messages")) return "შეტყობინებები";
  if (pathname.startsWith("/admin/leads")) return "ლიდები";
  if (pathname.startsWith("/admin/settings")) return "პარამეტრები";
  return "ადმინი";
}

export function AdminShell({
  children,
  logoUrl,
  userLabel,
  userImage,
  inboxCount,
  unreadMessages,
  newLeads,
  notificationThreads,
  notificationLeads,
  vapidPublicKey,
  signOutButton,
}: Props) {
  const pathname = usePathname();
  const logoSrc = logoUrl?.trim() || DEFAULT_LOGO_SRC;
  const logoRemote = logoSrc.startsWith("http");

  const badges = {
    messages: unreadMessages,
    leads: newLeads,
  };

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border/60">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  render={<Link href="/admin" />}
                  className="hover:bg-sidebar-accent"
                >
                  <Image
                    src={logoSrc}
                    alt="DekaByte"
                    width={120}
                    height={28}
                    className="h-7 w-auto max-w-[7.5rem] object-contain object-left"
                    unoptimized={logoRemote}
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">DekaByte</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Admin CMS
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>მენიუ</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV.map((item) => {
                    const active = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    const badge =
                      item.badgeKey && badges[item.badgeKey] > 0
                        ? badges[item.badgeKey]
                        : null;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={active}
                          tooltip={item.label}
                          render={<Link href={item.href} prefetch={false} />}
                        >
                          <Icon />
                          <span>{item.label}</span>
                          {badge ? (
                            <SidebarMenuBadge>{badge > 9 ? "9+" : badge}</SidebarMenuBadge>
                          ) : null}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border/60">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/" target="_blank" rel="noreferrer" />}
                  tooltip="საიტზე გადასვლა"
                >
                  <ExternalLink className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">dekabyte.ge</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-background/90 px-3 backdrop-blur-md md:px-4">
            <SidebarTrigger className="-ml-1 shrink-0" />
            <div className="hidden min-w-0 sm:block md:max-w-[10rem] lg:max-w-xs">
              <p className="truncate text-sm font-medium">{pageTitle(pathname)}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <AdminPushControls vapidPublicKey={vapidPublicKey} />
              <AdminNotificationsSheet
                totalCount={inboxCount}
                unreadMessages={unreadMessages}
                newLeads={newLeads}
                threads={notificationThreads}
                leads={notificationLeads}
              />
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                      aria-label="ანგარიში"
                    />
                  }
                >
                  <UserAvatar
                    image={userImage}
                    label={userLabel}
                    size={28}
                    badgeCount={0}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <p className="truncate text-sm font-medium">{userLabel}</p>
                    <p className="text-xs text-muted-foreground">ადმინისტრატორი</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/admin/messages" />}>
                    <MessageSquare className="size-4" />
                    შეტყობინებები
                    {unreadMessages > 0 ? (
                      <span className="ml-auto text-xs tabular-nums text-primary">
                        {unreadMessages}
                      </span>
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/admin/settings" />}>
                    <Settings className="size-4" />
                    პარამეტრები
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {signOutButton}
            </div>
          </header>

          <div
            className={cn(
              "flex flex-1 flex-col gap-6 p-4 md:p-6",
              "@container/admin-main",
            )}
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
