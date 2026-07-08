"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ItemsToolbarProps = {
  selectedCategoryId: string;
  categories: {
    id: string;
    name: string;
  }[];
  onCategoryChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function ItemsToolbar({
  categories,
  selectedCategoryId,
  onCategoryChange,
  search,
  onSearchChange,
}: ItemsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 bg-background pt-4">
      <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[300px] min-w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All categories</SelectItem>

            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="w-full max-w-[600px]">
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8"
        />
      </div>
    </div>
  );
}
