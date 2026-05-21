"use server";

import { auth } from "@/auth";
import { prisma } from "../db";

export async function createItem({
  name,
  groupId,
  category,
  price,
}: {
  name: string;
  groupId: string;
  category?: string;
  price?: number;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!groupId) {
    throw new Error("groupId is required");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId,
      },
    },
  });

  if (!membership) {
    throw new Error("No permission");
  }

  return prisma.$transaction(async (tx) => {
    const item = await tx.item.create({
      data: {
        name,
        category,
        groupId: membership.groupId,
      },
    });

    if (price && price > 0) {
      await tx.priceRecord.create({
        data: {
          itemId: item.id,
          price,
          createdById: session.user.id,
        },
      });
    }

    return item;
  });
}

export async function updateItem({
  itemId,
  name,
  groupId,
  category,
}: {
  itemId: string;
  name: string;
  groupId: string;
  category?: string;
}) {
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
  });

  if (!membership) {
    throw new Error("No permission");
  }

  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      groupId,
    },
  });

  if (!item) {
    throw new Error("Item not found");
  }

  return prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      name,
      category: category?.trim() || null,
    },
  });
}

export async function deleteItem({
  itemId,
  groupId,
}: {
  itemId: string;
  groupId: string;
}) {
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
  });

  if (!membership) {
    throw new Error("No permission");
  }

  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      groupId,
    },
  });

  if (!item) {
    throw new Error("Item not found");
  }

  return prisma.item.delete({
    where: {
      id: itemId,
    },
  });
}
