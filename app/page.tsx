import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getFirstGroupByUserId } from "@/lib/queries/group";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const group = await getFirstGroupByUserId(session.user.id);

  if (!group) {
    redirect("/select-group");
  }

  redirect(`/${group.id}`);
}
