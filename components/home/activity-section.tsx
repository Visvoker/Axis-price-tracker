import { cn } from "@/lib/utils";
import { getRecentActivitiesByGroupId } from "@/lib/queries/item";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type ActivitySectionProps = {
  groupId: string;
};

export async function ActivitySection({ groupId }: ActivitySectionProps) {
  const records = await getRecentActivitiesByGroupId(groupId);

  return (
    <Card className="flex flex-col h-full ring-0 shadow-none bg-background border py-0">
      <CardContent className="min-h-0 flex-1 overflow-y-auto px-0 divide-y p-0">
        {records.map((record) => {
          const latestPrice = Number(record.price);

          const baselinePrice = record.baselinePrice ?? 0;

          const changePercent =
            baselinePrice > 0
              ? ((latestPrice - baselinePrice) / baselinePrice) * 100
              : null;

          const hasChange = changePercent !== null;

          const isUp = hasChange && changePercent > 0;
          const isDown = hasChange && changePercent < 0;

          return (
            <div
              key={record.item.id}
              className="flex items-center justify-between p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    <Link href={`/${groupId}/items/${record.item.id}`}>
                      {record.item.name}
                    </Link>
                  </p>

                  {record.item.category && (
                    <span className="text-xs text-muted-foreground">
                      {record.item.category}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {record.createdBy.name ?? "Unknown"} ·{" "}
                  {record.createdAt.toLocaleString("zh-TW")}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">{latestPrice.toLocaleString()}</p>

                <p
                  className={cn(
                    "text-sm font-medium",
                    isUp && "text-red-500",
                    isDown && "text-emerald-500",
                    !isUp && !isDown && "text-muted-foreground",
                  )}
                >
                  {hasChange ? (
                    <>
                      {changePercent > 0 && "+"}
                      {changePercent.toFixed(1)}%
                    </>
                  ) : (
                    " "
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
