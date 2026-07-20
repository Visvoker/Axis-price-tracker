import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getCategoriesByGroupId } from "@/lib/queries/category";

import { SettingsPageClient } from "@/components/settings-page-client";
import { GroupManagementCard } from "@/components/settings/group-management-card";

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
      name: true,
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

  const isOwner = group?.ownerId === session.user.id;
  const isAdmin = currentMembership?.role === "ADMIN";
  const canManageGroup = isOwner || isAdmin;

  const canUpdateGroup = canManageGroup;
  const canDeleteGroup = isOwner;

  const activeInvite = await prisma.groupInvite.findFirst({
    where: {
      groupId,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      code: true,
      expiresAt: true,
    },
  });

  return (
    <div className="space-y-6 pt-3">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm"></p>
      </div>

      <SettingsPageClient
        categories={categories}
        groupId={groupId}
        members={group?.members ?? []}
        ownerId={group?.ownerId ?? null}
        canManageGroup={canManageGroup}
        isCurrentUserOwner={isOwner}
        isCurrentUserAdmin={isAdmin}
        currentUserId={session.user.id}
      />

      <GroupManagementCard
        groupId={groupId}
        activeInvite={
          activeInvite
            ? {
                code: activeInvite.code,
                expiresAt: activeInvite.expiresAt?.toISOString() ?? null,
              }
            : null
        }
        groupName={group?.name || ""}
        canUpdateGroup={canUpdateGroup}
        canDeleteGroup={canDeleteGroup}
      />
    </div>
  );
}
