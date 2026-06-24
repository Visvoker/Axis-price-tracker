import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

type AnalyticsItem = {
  label: string;
  value: string | number;
  description: string;
  variant?: "up" | "down" | "default";
};

type AnalyticsProps = {
  data: AnalyticsItem[];
};

export const Analytics = ({ data }: AnalyticsProps) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center flex-1">
            <AnalyticsCard
              label={item.label}
              value={item.value}
              description={item.description}
              variant={item.variant ?? "default"}
            />

            {index < data.length - 1 && (
              <DottedSeparator direction="vertical" />
            )}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
