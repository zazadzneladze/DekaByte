import { cn } from "@/lib/utils";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  showBreadcrumbs = true,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {showBreadcrumbs ? <AdminBreadcrumbs /> : null}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {eyebrow ? (
            <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
