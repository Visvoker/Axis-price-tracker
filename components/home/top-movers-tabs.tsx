"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MoverItem = {
  itemId: string;
  itemName: string;
  category: string | null;
  latestPrice: number;
  baselinePrice: number | null;
  changePercent: number | null;
};

type TopMoversTabsProps = {
  groupId: string;
  movers: {
    gainers: MoverItem[];
    losers: MoverItem[];
  };
};

export function TopMoversTabs({ groupId, movers }: TopMoversTabsProps) {
  return (
    <Tabs defaultValue="gainers" className="h-full">
      <Card className="flex h-full flex-col border py-0 ring-0 shadow-none">
        <CardHeader className="flex-row items-center justify-between space-y-0 p-3">
          <CardTitle className="text-base">Top Movers</CardTitle>

          <TabsList>
            <TabsTrigger value="gainers">Gainers</TabsTrigger>
            <TabsTrigger value="losers">Losers</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
          <TabsContent value="gainers" className="m-0">
            <MoverList groupId={groupId} items={movers.gainers} />
          </TabsContent>

          <TabsContent value="losers" className="m-0">
            <MoverList groupId={groupId} items={movers.losers} />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}

function MoverList({
  groupId,
  items,
}: {
  groupId: string;
  items: MoverItem[];
}) {
  return (
    <div className="h-full divide-y">
      {items.map((item) => {
        const changePercent = item.changePercent ?? 0;
        const isUp = changePercent > 0;
        const isDown = changePercent < 0;

        return (
          <div
            key={item.itemId}
            className="flex items-center justify-between p-3"
          >
            <div className="space-y-1">
              <Link
                href={`/${groupId}/items/${item.itemId}`}
                className="font-medium hover:underline"
              >
                {item.itemName}
              </Link>

              {item.category && (
                <p className="text-xs text-muted-foreground">{item.category}</p>
              )}
            </div>

            <div className="text-right">
              <p className="font-semibold">
                {item.latestPrice.toLocaleString()}
              </p>

              <p
                className={cn(
                  "text-sm font-medium",
                  isUp && "text-red-500",
                  isDown && "text-emerald-500",
                  !isUp && !isDown && "text-muted-foreground",
                )}
              >
                {isUp && "+"}
                {changePercent.toFixed(1)}%
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
