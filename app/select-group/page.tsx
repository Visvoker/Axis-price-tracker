import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { getFirstGroupByUserId } from "@/lib/queries/group";
import { CreateGroupForm } from "@/components/create-group-form";

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{
    callbackUrl?: string;
    accessDenied?: string;
  }>;
};

export default async function SelectGroupPage({ searchParams }: Props) {
  const { callbackUrl, accessDenied } = await searchParams;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await getFirstGroupByUserId(session.user.id);

  if (!accessDenied && !callbackUrl && membership?.group.id) {
    redirect(`/${membership.group.id}`);
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>無法存取群組</CardTitle>
            <CardDescription>
              你可能已被移出此群組，或這個群組已不存在。
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-end gap-2">
            {membership?.group.id ? (
              <Button asChild>
                <Link href={`/${membership.group.id}`}>前往我的其他群組</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/create-group">建立群組</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <CreateGroupForm />
    </div>
  );
}
