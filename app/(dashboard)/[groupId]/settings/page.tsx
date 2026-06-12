import { prisma } from "@/lib/db";
import { CreateInviteButton } from "@/components/create-invite-button";
import { getCategoriesByGroupId } from "@/lib/queries/category";
import { SettingsPageClient } from "@/components/settings-page-client";

type SettingsPageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { groupId } = await params;

  const invites = await prisma.groupInvite.findMany({
    where: {
      groupId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await getCategoriesByGroupId(groupId);

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h1 className="text-2xl font-semibold">Group Settings</h1>
        <p className="text-muted-foreground">
          Manage invite links and group settings.
        </p>
      </div>

      <CreateInviteButton groupId={groupId} />

      <div className="space-y-2">
        {invites.map((invite) => (
          <div key={invite.id} className="rounded-lg border p-4">
            <p className="text-sm font-medium">
              localhost:3000/invite/{invite.code}
            </p>
            <p className="text-sm text-muted-foreground">
              Expires at: {invite.expiresAt?.toLocaleString("zh-TW")}
            </p>
          </div>
        ))}
      </div>

      <SettingsPageClient categories={categories} groupId={groupId} />
    </div>
  );
}
