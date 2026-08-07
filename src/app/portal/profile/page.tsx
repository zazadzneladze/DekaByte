import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getClientUserById } from "@/db/queries";
import { PortalProfileForm } from "@/components/portal/profile-form";
import { clampSignatureTransform } from "@/lib/invoice-signature";

export default async function PortalProfilePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    redirect("/portal/login");
  }
  if (session.user.needsOnboarding) {
    redirect("/portal/onboarding");
  }

  const user = await getClientUserById(session.user.id);
  if (!user) redirect("/portal/login");

  return (
    <PortalProfileForm
      userId={user.id}
      initialName={user.displayName ?? ""}
      initialPhone={user.phone}
      initialAddress={user.address}
      initialAvatarUrl={user.avatarUrl || user.image}
      initialSignatureUrl={user.invoiceSignatureUrl}
      initialSignatureTransform={clampSignatureTransform(
        user.invoiceSignatureTransform ?? undefined,
      )}
      mode="profile"
    />
  );
}
