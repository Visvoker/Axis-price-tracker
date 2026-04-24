import { ItemsPageClient } from "@/components/dashboard/items/items-page-client";
import { prisma } from "@/lib/db";

export default async function ItemsPage() {
  const items = await prisma.item.findMany({
    include: {
      prices: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ItemsPageClient
      items={items.map((item) => ({
        id: item.id,
        name: item.name,
        latestPrice: item.prices[0]?.price
          ? Number(item.prices[0].price)
          : null,
        updatedAt: item.updatedAt.toLocaleString(),
      }))}
    />
  );
}
