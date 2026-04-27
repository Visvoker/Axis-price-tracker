"use client";

import { useMemo, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type PriceChartData = {
  date: string;
  price: number;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Taipei",
  });
}

const ranges = [
  { label: "3D", value: "3d" },
  { label: "7D", value: "7d" },
  { label: "14D", value: "14d" },
  { label: "30D", value: "30d" },
  { label: "All", value: "all" },
] as const;

const itemClass =
  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground";

export function PriceChart({ data }: { data: PriceChartData[] }) {
  const [range, setRange] = useState<"3d" | "7d" | "14d" | "30d" | "all">("7d");

  const filteredData = useMemo(() => {
    if (range === "all") return data;

    const days =
      range === "3d" ? 3 : range === "7d" ? 7 : range === "14d" ? 14 : 30;
    const now = new Date().getTime();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    return data.filter((item) => {
      const itemTime = new Date(item.date).getTime();

      return itemTime >= cutoff && itemTime <= now;
    });
  }, [data, range]);

  return (
    <>
      <div className="flex justify-end">
        <ToggleGroup
          spacing={1}
          type="single"
          value={range}
          onValueChange={(value) => {
            if (value) setRange(value as typeof range);
          }}
        >
          {ranges.map((r) => (
            <ToggleGroupItem
              key={r.value}
              value={r.value}
              className={itemClass}
            >
              {r.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: -20, bottom: -10 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("zh-TW", {
                  month: "numeric",
                  day: "numeric",
                  timeZone: "Asia/Taipei",
                })
              }
            />

            <YAxis tickFormatter={(value) => Number(value).toLocaleString()} />

            <Tooltip
              labelFormatter={(value) => formatDateTime(String(value))}
              formatter={(value) => [
                `${Number(value).toLocaleString()} meso`,
                "Price",
              ]}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
