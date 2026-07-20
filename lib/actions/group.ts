"use server";

import { nanoid } from "nanoid";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type CreateGroupState = {
  error: string | null;
};

export async function createGroup(
  prevState: CreateGroupState,
  formData: FormData,
): Promise<CreateGroupState> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = formData.get("name")?.toString().trim();

  if (!name) {
    return { error: "群組的名稱不能為空" };
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

export async function updateGroup(groupId: string, name: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("群組名稱不能為空");
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
    throw new Error("You do not have permission to update this group");
  }

  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      name: trimmedName,
    },
  });

  revalidatePath(`/${groupId}`);
  revalidatePath(`/${groupId}/settings`);
}

export async function deleteGroup(groupId: string) {
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

  if (!isOwner) {
    throw new Error("Only owner can delete this group");
  }

  await prisma.group.delete({
    where: {
      id: groupId,
    },
  });

  const nextMembership = await prisma.groupMember.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      group: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (nextMembership?.group.id) {
    redirect(`/${nextMembership.group.id}`);
  }

  redirect("/select-group");
}

export async function leaveGroup(groupId: string) {
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
      group: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this group");
  }

  const isOwner = membership.group.ownerId === session.user.id;
  const memberCount = membership.group.members.length;

  if (isOwner && memberCount > 1) {
    throw new Error("Owner cannot leave a group with other members");
  }

  if (isOwner && memberCount === 1) {
    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });
  } else {
    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId,
        },
      },
    });
  }

  const nextMembership = await prisma.groupMember.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      group: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (nextMembership?.group.id) {
    redirect(`/${nextMembership.group.id}`);
  }

  redirect("/select-group");
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

  const now = new Date();

  const existingInvite = await prisma.groupInvite.findFirst({
    where: {
      groupId,
      expiresAt: {
        gt: now,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingInvite) {
    return existingInvite;
  }

  const invite = await prisma.groupInvite.create({
    data: {
      groupId,
      createdById: session.user.id,
      code: nanoid(12),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1),
    },
  });

  revalidatePath(`/${groupId}/settings`);

  return invite;
}

export async function regenerateGroupInvite(groupId: string) {
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
    throw new Error("Only owner or admin can regenerate invite links");
  }

  const now = new Date();

  await prisma.groupInvite.updateMany({
    where: {
      groupId,
      expiresAt: {
        gt: now,
      },
    },
    data: {
      expiresAt: now,
    },
  });

  const invite = await prisma.groupInvite.create({
    data: {
      groupId,
      createdById: session.user.id,
      code: nanoid(12),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1),
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

export async function updateGroupMemberRole({
  groupId,
  memberId,
  role,
}: {
  groupId: string;
  memberId: string;
  role: "ADMIN" | "MEMBER";
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentMembership = await prisma.groupMember.findUnique({
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

  if (!currentMembership) {
    throw new Error("You are not a member of this group");
  }

  const isOwner = currentMembership.group.ownerId === session.user.id;

  if (!isOwner) {
    throw new Error("Only owner can update member roles");
  }

  const targetMember = await prisma.groupMember.findFirst({
    where: {
      id: memberId,
      groupId,
    },
  });

  if (!targetMember) {
    throw new Error("Member not found");
  }

  if (targetMember.userId === currentMembership.group.ownerId) {
    throw new Error("Owner role cannot be changed");
  }

  await prisma.groupMember.update({
    where: {
      id: memberId,
    },
    data: {
      role,
    },
  });

  revalidatePath(`/${groupId}/settings`);
}

export async function removeGroupMember({
  groupId,
  memberId,
}: {
  groupId: string;
  memberId: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentMembership = await prisma.groupMember.findUnique({
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

  if (!currentMembership) {
    throw new Error("You are not a member of this group");
  }

  const isOwner = currentMembership.group.ownerId === session.user.id;
  const isAdmin = currentMembership.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("You do not have permission to remove members");
  }

  const targetMember = await prisma.groupMember.findFirst({
    where: {
      id: memberId,
      groupId,
    },
  });

  if (!targetMember) {
    throw new Error("Member not found");
  }

  if (targetMember.userId === currentMembership.group.ownerId) {
    throw new Error("Owner cannot be removed");
  }

  const isTargetOwner = targetMember.userId === currentMembership.group.ownerId;
  const isTargetMember = targetMember.role === "MEMBER";

  if (isTargetOwner) {
    throw new Error("Owner cannot be removed");
  }

  if (isAdmin && !isOwner && !isTargetMember) {
    throw new Error("Admin can only remove members");
  }

  await prisma.groupMember.delete({
    where: {
      id: memberId,
    },
  });

  revalidatePath(`/${groupId}/settings`);
}
