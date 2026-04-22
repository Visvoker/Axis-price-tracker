"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

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

  await prisma.priceRecord.create({
    data: {
      itemId,
      price,
      createdById: session.user.id,
    },
  });
}
