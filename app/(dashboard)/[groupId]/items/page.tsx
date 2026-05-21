import { ItemsPageClient } from "@/components/home/items/items-page-client";
import { prisma } from "@/lib/db";

type ItemsPage = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function ItemsPage({ params }: ItemsPage) {
  const { groupId } = await params;

  const items = await prisma.item.findMany({
    where: {
      groupId,
    },
    include: {
      prices: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <ItemsPageClient
      groupId={groupId}
      items={items.map((item) => ({
        id: item.id,
        name: item.name,
        latestPrice: item.prices[0]?.price
          ? Number(item.prices[0].price)
          : null,
        updatedAt: item.prices[0]?.createdAt.toLocaleString("zh-TW") ?? "-",
      }))}
    />
  );
}
