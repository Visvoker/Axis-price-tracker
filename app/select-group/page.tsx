import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { getFirstGroupByUserId } from "@/lib/queries/group";
import { CreateGroupForm } from "@/components/create-group-form";

type Props = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function SelectGroupPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;

  const session = await auth();

  // console.log("session:", session);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await getFirstGroupByUserId(session.user.id);

  if (!callbackUrl && membership?.group.id) {
    redirect(`/${membership.group.id}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <CreateGroupForm />
    </div>
  );
}
