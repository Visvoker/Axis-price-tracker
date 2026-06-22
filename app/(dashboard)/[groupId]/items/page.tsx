import { ItemsPageClient } from "@/components/home/items/items-page-client";
import { prisma } from "@/lib/db";
import { getCategoriesByGroupId } from "@/lib/queries/category";

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
      category: true,
    },
  });

  items.sort((a, b) => {
    const latestPriceA = a.prices[0];
    const latestPriceB = b.prices[0];

    const aTime = latestPriceA ? latestPriceA.createdAt.getTime() : 0;
    const bTime = latestPriceB ? latestPriceB.createdAt.getTime() : 0;

    return bTime - aTime;
  });

  const categories = await getCategoriesByGroupId(groupId);

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
        currentCategory: item.category
          ? {
              id: item.category.id,
              name: item.category.name,
            }
          : null,
      }))}
      categories={categories}
    />
  );
}
