import { getTrendingItemsByGroupId } from "@/lib/queries/price";

import { TrendingItemsChart } from "./trending-items-chart";

type TrendingItemsSectionProps = {
  groupId: string;
};

export async function TrendingItemsSection({
  groupId,
}: TrendingItemsSectionProps) {
  const items = await getTrendingItemsByGroupId(groupId);

  const chartData = items.map((item) => ({
    name: item.name,
    count: item._count.prices,
  }));

  return <TrendingItemsChart data={chartData} />;
}
