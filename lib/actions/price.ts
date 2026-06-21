"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getItemWithPrices } from "../queries/item";

export async function getPriceRecordItemData(itemId: string, groupId: string) {
  return getItemWithPrices(itemId, groupId);
}

export async function createPriceRecord({
  itemId,
  price,
}: {
  itemId: string;
  price: number;
}) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  if (!price || price <= 0) {
    throw new Error("Invalid price");
  }

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    select: {
      groupId: true,
    },
  });

  if (!item) {
    throw new Error("Item not found");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId: item.groupId,
      },
    },
  });

  if (!membership) {
    throw new Error("No permission");
  }

  await prisma.priceRecord.create({
    data: {
      itemId,
      price,
      createdById: session.user.id,
    },
  });
}

export async function updatePriceRecord({
  priceRecordId,
  price,
}: {
  priceRecordId: string;
  price: number;
}) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  if (!price || price <= 0) {
    throw new Error("Invalid price");
  }

  const priceRecord = await prisma.priceRecord.findUnique({
    where: {
      id: priceRecordId,
    },
    select: {
      item: {
        select: {
          groupId: true,
        },
      },
    },
  });

  if (!priceRecord) {
    throw new Error("Price record not found");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId: priceRecord.item.groupId,
      },
    },
  });

  if (!membership) {
    throw new Error("No permission");
  }

  await prisma.priceRecord.update({
    where: {
      id: priceRecordId,
    },
    data: {
      price,
    },
  });
}

export async function deletePriceRecord({
  priceRecordId,
}: {
  priceRecordId: string;
}) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  const priceRecord = await prisma.priceRecord.findUnique({
    where: {
      id: priceRecordId,
    },
    select: {
      item: {
        select: {
          groupId: true,
        },
      },
    },
  });

  if (!priceRecord) {
    throw new Error("Price record not found");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId: priceRecord.item.groupId,
      },
    },
  });

  if (!membership) {
    throw new Error("No permission");
  }

  await prisma.priceRecord.delete({
    where: {
      id: priceRecordId,
    },
  });
}
