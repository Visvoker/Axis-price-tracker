import { getDashboardSummaryByGroupId } from "@/lib/queries/dashboard";

import { Analytics } from "../analytics";

type DashboardSummaryProps = {
  groupId: string;
};

export async function DashboardSummary({ groupId }: DashboardSummaryProps) {
  const summary = await getDashboardSummaryByGroupId(groupId);

  const items = [
    {
      label: "追蹤商品",
      value: summary.totalItems.toLocaleString(),
      description: `${summary.itemsWithPrices} 有價格 · ${summary.itemsWithoutPrices} 尚無價格`,
    },
    {
      label: "今日更新",
      value: summary.todayRecordCount.toLocaleString(),
      description: `${summary.todayUpdatedItems} 個商品已更新`,
    },
    {
      label: "近期上漲",
      value: summary.risingItems.toLocaleString(),
      description: "相較前一筆價格",
      variant: "up" as const,
    },
    {
      label: "近期下跌",
      value: summary.droppingItems.toLocaleString(),
      description: "相較前一筆價格",
      variant: "down" as const,
    },
    {
      label: "待更新",
      value: summary.staleItems.toLocaleString(),
      description: `${summary.staleDays}+ 天未更新或尚無價格`,
    },
  ];
  return <Analytics data={items} />;
}
