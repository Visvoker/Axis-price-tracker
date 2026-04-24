"use server";

import { auth } from "@/auth";
import { prisma } from "../db";

export async function createItem({
  name,
  category,
  price,
}: {
  name: string;
  category?: string;
  price?: number;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const membership = await prisma.groupMember.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      groupId: true,
    },
  });

  if (!membership) {
    throw new Error("No group found");
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
