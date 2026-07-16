import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getFirstGroupByUserId } from "@/lib/queries/group";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await getFirstGroupByUserId(session.user.id);

  if (!membership) {
    redirect("/select-group");
  }

  redirect(`/${membership.group.id}`);
}
