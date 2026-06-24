import { prisma } from "@/lib/db";

const STALE_DAYS = 7;

function getStartOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function getStaleCutoffDate() {
  const date = new Date();
  date.setDate(date.getDate() - STALE_DAYS);
  return date;
}

export async function getDashboardSummaryByGroupId(groupId: string) {
  if (!groupId) {
    throw new Error("groupId is required");
  }

  const startOfToday = getStartOfToday();
  const staleCutoffDate = getStaleCutoffDate();

  const [items, todayRecordCount] = await Promise.all([
    prisma.item.findMany({
      where: { groupId },
      select: {
        id: true,
        prices: {
          orderBy: { createdAt: "desc" },
          take: 2,
          select: {
            price: true,
            createdAt: true,
          },
        },
      },
    }),

    prisma.priceRecord.count({
      where: {
        item: { groupId },
        createdAt: {
          gte: startOfToday,
        },
      },
    }),
  ]);

  let itemsWithPrices = 0;
  let todayUpdatedItems = 0;
  let risingItems = 0;
  let droppingItems = 0;
  let staleItems = 0;

  for (const item of items) {
    const [latestPrice, previousPrice] = item.prices;

    if (!latestPrice) {
      staleItems += 1;
      continue;
    }

    itemsWithPrices += 1;

    if (latestPrice.createdAt >= startOfToday) {
      todayUpdatedItems += 1;
    }

    if (latestPrice.createdAt < staleCutoffDate) {
      staleItems += 1;
    }

    if (!previousPrice) {
      continue;
    }

    const latest = Number(latestPrice.price);
    const previous = Number(previousPrice.price);

    if (latest > previous) {
      risingItems += 1;
    }

    if (latest < previous) {
      droppingItems += 1;
    }
  }

  return {
    totalItems: items.length,
    itemsWithPrices,
    itemsWithoutPrices: items.length - itemsWithPrices,
    todayRecordCount,
    todayUpdatedItems,
    risingItems,
    droppingItems,
    staleItems,
    staleDays: STALE_DAYS,
  };
}
