import Link from "next/link";
import { ClientProjectForm } from "@/components/admin/client-project-form";
import { Button } from "@/components/ui/button";

export default function NewClientProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            ახალი კლიენტის პროექტი
          </h1>
          <p className="text-sm text-muted-foreground">
            მიუთითეთ კლიენტის Google ელფოსტა — მხოლოდ ის შეძლებს შესვლას
          </p>
        </div>
        <Button variant="outline" render={<Link href="/admin/clients" />}>
          უკან
        </Button>
      </div>
      <ClientProjectForm mode="create" />
    </div>
  );
}
