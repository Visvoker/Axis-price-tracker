import { TrendingUp, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type AnalyticsCardProps = {
  label: string;
  value: string | number;
  description: string;
  variant?: "up" | "down" | "default";
};

export const AnalyticsCard = ({
  label,
  description,
  value,
  variant,
}: AnalyticsCardProps) => {
  const iconColor =
    variant === "up"
      ? "text-red-500"
      : variant === "down"
        ? "text-emerald-500"
        : "text-base";
  const Icon =
    variant === "up" ? TrendingUp : variant === "down" ? TrendingDown : null;

  return (
    <Card className="shadow-none border-0 rounded-none w-full ring-0 ">
      <CardHeader className="px-2 md:px-4">
        <div className="flex items-center gap-x-1 md:gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate lg:text-[14px] xl:text-base">
              {label}
            </span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            {Icon && (
              <Icon className={cn(iconColor, "size-4 lg:size-5 xl:size-6")} />
            )}
          </div>
        </div>
        <CardTitle className="md:text-xl xl:text-3xl font-semibold ">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
