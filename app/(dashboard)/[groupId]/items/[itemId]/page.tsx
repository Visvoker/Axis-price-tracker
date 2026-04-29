import ItemDetailClient from "@/components/dashboard/items/item-detail-client";
import { getItemWithPrices } from "@/lib/queries/item";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ groupId: string; itemId: string }>;
}) {
  const { groupId, itemId } = await params;

  const item = await getItemWithPrices(itemId, groupId);

  if (!item) return <div>Item not found</div>;

  return (
    <ItemDetailClient
      item={{
        id: item.id,
        name: item.name,
        category: item.category,
        latestPrice: item.prices[0] ? Number(item.prices[0].price) : null,
        totalRecords: item.prices.length,
        prices: item.prices.map((price) => ({
          id: price.id,
          price: Number(price.price),
          createdAt: price.createdAt,
          createdBy: { name: price.createdBy.name },
        })),
      }}
    />
  );
}
