import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { portalListProjects } from "@/db/queries";
import { clientProjectStatusLabel } from "@/config/client-portal";
import { ProgressBar, ProgressRing } from "@/components/portal/progress";
import { Badge } from "@/components/ui/badge";

export default async function PortalHomePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    redirect("/portal/login");
  }
  if (session.user.needsOnboarding) {
    redirect("/portal/onboarding");
  }

  const projects = await portalListProjects(session.user.email);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.16em] text-electric uppercase">
          კლიენტის სივრცე
        </p>
        <h1 className="text-display text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">
          გამარჯობა, {session.user.displayName}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          პროექტის პროგრესი, ფაილები და შეტყობინებები — ერთ ადგილას.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center text-sm text-muted-foreground">
          პროექტები ჯერ არ არის მიბმული ამ ანგარიშზე.
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/portal/projects/${project.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-[0_1px_2px_rgb(18_21_26/0.04)] transition-all hover:border-electric/25 hover:shadow-[0_8px_28px_rgb(18_21_26/0.06)] sm:p-5"
              >
                <ProgressRing value={project.progressPercent} size={64} />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold tracking-tight text-foreground group-hover:text-electric">
                      {project.title}
                    </span>
                    <Badge variant="secondary">
                      {clientProjectStatusLabel(project.status)}
                    </Badge>
                  </div>
                  <ProgressBar value={project.progressPercent} />
                  <p className="text-xs text-muted-foreground">
                    გაკეთებულია {project.progressPercent}%
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
