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
    },
  });

  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    category: item.category,
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
