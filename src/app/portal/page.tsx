import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { portalListProjects } from "@/db/queries";
import { clientProjectStatusLabel } from "@/config/client-portal";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          გამარჯობა, {session.user.displayName}
        </h1>
        <p className="text-sm text-muted-foreground">
          თქვენი პროექტების სტატუსი, ფაილები და შეტყობინებები
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          პროექტები ჯერ არ არის მიბმული ამ ანგარიშზე.
        </p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/portal/projects/${project.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-secondary/40"
              >
                <span className="font-medium">{project.title}</span>
                <Badge variant="secondary">
                  {clientProjectStatusLabel(project.status)}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
