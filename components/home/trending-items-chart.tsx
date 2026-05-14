"use client";

type TrendingItemsChartProps = {
  data: {
    name: string;
    count: number;
  }[];
};

export function TrendingItemsChart({ data }: TrendingItemsChartProps) {
  const maxCount = Math.max(...data.map((item) => item.count), 0);

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

        return (
          <div
            key={item.name}
            className="grid grid-cols-[80px_1fr_40px] items-center gap-3"
          >
            <span className="truncate text-sm font-medium">{item.name}</span>

            <div className="h-5 overflow-hidden rounded-md bg-muted">
              <div
                className="flex h-full items-center rounded-md bg-[var(--chart-2)] px-3 text-sm font-medium text-white"
                style={{
                  width: `${percent}%`,
                }}
              />
            </div>

            <span className="text-right text-sm font-medium text-muted-foreground">
              {item.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
