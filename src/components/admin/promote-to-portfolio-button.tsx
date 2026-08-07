"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { promoteClientProjectToPortfolio } from "@/actions/clients";
import { Button } from "@/components/ui/button";

type Props = {
  projectId: string;
  eligible: boolean;
  portfolioProjectId: string | null;
};

export function PromoteToPortfolioButton({
  projectId,
  eligible,
  portfolioProjectId,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (portfolioProjectId) {
    return (
      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/admin/projects/${portfolioProjectId}/edit`} />}
      >
        პორტფოლიოს დრაფტი
      </Button>
    );
  }

  if (!eligible) return null;

  return (
    <Button
      type="button"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await promoteClientProjectToPortfolio(projectId);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("პორტფოლიოს დრაფტი შეიქმნა");
          router.push(`/admin/projects/${result.data.portfolioProjectId}/edit`);
          router.refresh();
        });
      }}
    >
      პორტფოლიოში დამატება
    </Button>
  );
}
