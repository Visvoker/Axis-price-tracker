import { prisma } from "@/lib/db";

export async function getFirstGroupByUserId(userId: string) {
  return prisma.groupMember.findFirst({
    where: {
      userId,
    },
    include: {
      group: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getGroupWithMembership(userId: string, groupId: string) {
  return prisma.groupMember.findFirst({
    where: {
      userId,
      groupId,
    },
    include: {
      group: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function getGroupsByUserId(userId: string) {
  return prisma.groupMember.findMany({
    where: {
      userId,
    },
    include: {
      group: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
