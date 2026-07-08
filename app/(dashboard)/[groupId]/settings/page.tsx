import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getCategoriesByGroupId } from "@/lib/queries/category";

import { CreateInviteButton } from "@/components/create-invite-button";
import { SettingsPageClient } from "@/components/settings-page-client";

type SettingsPageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { groupId } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentMembership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId,
      },
    },
  });

  const categories = await getCategoriesByGroupId(groupId);

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: {
      ownerId: true,
      members: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          userId: true,
          role: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  const canManageMembers =
    group?.ownerId === session.user.id || currentMembership?.role === "ADMIN";

  const invites = await prisma.groupInvite.findMany({
    where: {
      groupId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6 pt-3">
      <div>
        <h1 className="text-2xl font-semibold">Group Settings</h1>
        {/* <p className="text-muted-foreground">
          Manage invite links and group settings.
        </p> */}
      </div>
      {/* <CreateInviteButton groupId={groupId} />

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
      </div> */}
      <SettingsPageClient
        categories={categories}
        groupId={groupId}
        members={group?.members ?? []}
        ownerId={group?.ownerId ?? null}
        canManageMembers={canManageMembers}
      />{" "}
    </div>
  );
}
