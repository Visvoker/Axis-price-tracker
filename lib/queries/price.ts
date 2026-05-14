import { prisma } from "../db";

export async function getTopMoversByGroupId(groupId: string) {
  if (!groupId) {
    throw new Error("groupId is required");
  }

  const records = await prisma.priceRecord.findMany({
    where: {
      item: {
        groupId,
      },
    },
    include: {
      item: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const uniqueRecords = records.filter(
    (record, index, self) =>
      index === self.findIndex((r) => r.itemId === record.itemId),
  );

  const movers = await Promise.all(
    uniqueRecords.map(async (record) => {
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

      const latestPrice = Number(record.price);

      const baselinePrice = baselineRecord
        ? Number(baselineRecord.price)
        : null;

      const changePercent =
        baselinePrice && baselinePrice > 0
          ? ((latestPrice - baselinePrice) / baselinePrice) * 100
          : null;

      return {
        itemId: record.item.id,
        itemName: record.item.name,
        category: record.item.category,

        latestPrice,
        baselinePrice,
        changePercent,
      };
    }),
  );

  return {
    gainers: movers
      .filter((m) => m.changePercent !== null && m.changePercent > 0)
      .sort((a, b) => b.changePercent! - a.changePercent!)
      .slice(0, 5),

    losers: movers
      .filter((m) => m.changePercent !== null && m.changePercent < 0)
      .sort((a, b) => a.changePercent! - b.changePercent!)
      .slice(0, 5),
  };
}
