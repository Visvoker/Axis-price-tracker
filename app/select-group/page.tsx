import { auth } from "@/auth";
import { createGroup } from "@/lib/actions/group";
import { getFirstGroupByUserId } from "@/lib/queries/group";
import { redirect } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SelectGroupPage() {
  const session = await auth();

  console.log("session:", session);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await getFirstGroupByUserId(session.user.id);

  if (membership?.group.id) {
    redirect(`/${membership.group.id}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <form action={createGroup}>
          <div className="space-y-6">
            <CardHeader>
              <CardTitle>建立你的第一個 Group</CardTitle>
              <CardDescription>
                先建立一個 group 就能與夥伴們一起記錄道具價格
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="name"
                  name="name"
                  placeholder="Axis Guild"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                建立
              </Button>
            </CardContent>
          </div>
        </form>
      </Card>
    </div>
  );
}
