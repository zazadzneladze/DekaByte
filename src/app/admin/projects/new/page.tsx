import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          ახალი პროექტი
        </h1>
        <p className="text-sm text-muted-foreground">
          შეავსეთ ძირითადი ველები. სურათები ხელმისაწვდომი იქნება შენახვის შემდეგ.
        </p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
