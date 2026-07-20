import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

import { InviteConfirmCard } from "@/components/invite/invite-confirm-card";
import { InviteGroupFullCard } from "@/components/invite/invite-group-full-card";
import { AlreadyMemberCard } from "@/components/invite/already-member-card";
import { ExpiredInviteCard } from "@/components/invite/expired-invite-card";
import { InvalidInviteCard } from "@/components/invite/invalid-invite-card";

type InvitePageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;

  const session = await auth();

  const invite = await prisma.groupInvite.findUnique({
    where: { code },
    include: {
      group: {
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
          members: true,
        },
      },
    },
  });

  if (!invite) {
    return <InvalidInviteCard />;
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return <ExpiredInviteCard />;
  }

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/invite/${code}`);
  }

  const alreadyMember = invite.group.members.some(
    (member) => member.userId === session.user.id,
  );

  if (alreadyMember) {
    return <AlreadyMemberCard groupId={invite.groupId} />;
  }

  if (invite.group.members.length >= invite.group.maxMembers) {
    return <InviteGroupFullCard />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <InviteConfirmCard
        code={code}
        groupName={invite.group.name}
        ownerName={
          invite.group.owner?.name ??
          invite.group.owner?.email ??
          "Unknown owner"
        }
        memberCount={invite.group.members.length}
        maxMembers={invite.group.maxMembers}
      />
    </main>
  );
}
