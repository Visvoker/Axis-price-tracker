"use client";

import { LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ItemsToolbarProps = {
  view: "table" | "card";
  onViewChange: (view: "table" | "card") => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function ItemsToolbar({
  view,
  onViewChange,
  search,
  onSearchChange,
}: ItemsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4">
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(value) => {
          if (value === "table" || value === "card") {
            onViewChange(value);
          }
        }}
      >
        <ToggleGroupItem value="table" aria-label="Table view">
          <List className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem value="card" aria-label="Card view">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="w-full max-w-xs">
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
