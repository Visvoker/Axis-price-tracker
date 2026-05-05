"use server";

import { nanoid } from "nanoid";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createGroup(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = formData.get("name")?.toString().trim();

  if (!name) {
    throw new Error("Group 名稱不能為空");
  }

  const group = await prisma.group.create({
    data: {
      name,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "ADMIN",
        },
      },
    },
  });

  redirect(`/${group.id}`);
}

export async function createGroupInvite(groupId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId,
      },
    },
    include: {
      group: true,
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this group");
  }

  const isOwner = membership.group.ownerId === session.user.id;
  const isAdmin = membership.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("Only owner or admin can create invite links");
  }

  const invite = await prisma.groupInvite.create({
    data: {
      groupId,
      createdById: session.user.id,
      code: nanoid(12),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  revalidatePath(`/${groupId}/settings`);

  return invite;
}

export async function acceptGroupInvite(code: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/invite/${code}`);
  }

  const invite = await prisma.groupInvite.findUnique({
    where: {
      code,
    },
    include: {
      group: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!invite) {
    throw new Error("Invite link not found");
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    throw new Error("Invite link expired");
  }

  const alreadyMember = invite.group.members.some(
    (member) => member.userId === session.user.id,
  );

  if (alreadyMember) {
    redirect(`/${invite.groupId}`);
  }

  if (invite.group.members.length >= invite.group.maxMembers) {
    throw new Error("Group is full");
  }

  await prisma.groupMember.create({
    data: {
      userId: session.user.id,
      groupId: invite.groupId,
      role: "MEMBER",
    },
  });

  redirect(`/${invite.groupId}`);
}
