import { Button } from "@/components/ui/button";
import { acceptGroupInvite } from "@/lib/actions/group";

type InvitePageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form action={acceptGroupInvite.bind(null, code)}>
        <div className="space-y-4 rounded-lg border p-6">
          <div>
            <h1 className="text-xl font-semibold">Join Group</h1>
            <p className="text-sm text-muted-foreground">
              Click below to join this group.
            </p>
          </div>

          <Button type="submit" className="w-full">
            Accept Invite
          </Button>
        </div>
      </form>
    </div>
  );
}
