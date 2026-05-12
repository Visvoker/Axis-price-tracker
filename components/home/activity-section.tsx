import { cn } from "@/lib/utils";
import { getRecentActivityItemsByGroupId } from "@/lib/queries/item";

import { Card, CardContent } from "@/components/ui/card";

type ActivitySectionProps = {
  groupId: string;
};

export async function ActivitySection({ groupId }: ActivitySectionProps) {
  const items = await getRecentActivityItemsByGroupId(groupId);

  console.log(items);

  return (
    <Card className="flex flex-col h-full ring-0 shadow-none bg-background border-1 py-0">
      <CardContent className="min-h-0 flex-1 overflow-y-auto px-0 divide-y p-0">
        {items.map((item) => {
          const latest = item.prices[0];
          const previous = item.prices[1];

          const latestPrice = Number(latest?.price ?? 0);
          const previousPrice = Number(previous?.price ?? 0);

          const changePercent =
            previousPrice > 0
              ? ((latestPrice - previousPrice) / previousPrice) * 100
              : 0;

          const isUp = changePercent > 0;
          const isDown = changePercent < 0;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{item.name}</p>

                  {item.category && (
                    <span className="text-xs text-muted-foreground">
                      {item.category}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {latest?.createdBy.name ?? "Unknown"} ·{" "}
                  {latest?.createdAt.toLocaleString("zh-TW")}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">{latestPrice.toLocaleString()}</p>

                <p
                  className={cn(
                    "text-sm font-medium",
                    isUp && "text-emerald-500",
                    isDown && "text-red-500",
                    !isUp && !isDown && "text-muted-foreground",
                  )}
                >
                  {changePercent > 0 && "+"}
                  {changePercent.toFixed(1)}%
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
