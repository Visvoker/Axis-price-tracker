import { prisma } from "@/lib/db";

export async function getItemsByGroupId(groupId: string) {
  return prisma.item.findMany({
    where: { groupId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, category: true },
  });
}

export async function getItemWithPrices(itemId: string, groupId: string) {
  const item = await prisma.item.findFirst({
    where: { id: itemId, groupId },
    include: {
      prices: {
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: { name: true },
          },
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    category: item.category?.name,
    latestPrice: item.prices[0] ? Number(item.prices[0].price) : null,
    totalRecords: item.prices.length,
    prices: item.prices.map((price) => ({
      id: price.id,
      price: Number(price.price),
      createdAt: price.createdAt.toISOString(),
      createdBy: price.createdBy,
    })),
  };
}

export async function getRecentActivitiesByGroupId(groupId: string) {
  if (!groupId) {
    throw new Error("groupId is required");
  }

  const records = await prisma.priceRecord.findMany({
    where: { item: { groupId } },
    include: {
      item: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 30,
  });

  const uniqueRecords = records.filter(
    (record, index, self) =>
      index === self.findIndex((r) => r.itemId === record.itemId),
  );

  const activities = await Promise.all(
    uniqueRecords.slice(0, 8).map(async (record) => {
      const startOfDay = new Date(record.createdAt);

      startOfDay.setHours(0, 0, 0, 0);

      const baselineRecord = await prisma.priceRecord.findFirst({
        where: {
          itemId: record.itemId,
          createdAt: {
            lt: startOfDay,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        ...record,
        baselinePrice: baselineRecord ? Number(baselineRecord.price) : null,
      };
    }),
  );

  return activities;
}
