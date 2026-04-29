"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ItemsTable } from "@/components/items/items-table";
import { AddPriceDialog } from "@/components/items/add-price-dialog";

import { createPriceRecord } from "@/lib/actions/price";
import { ItemsToolbar } from "./items-toolbar";

type Item = {
  id: string;
  name: string;
  latestPrice: number | null;
  updatedAt: string;
};

export function ItemsPageClient({ items }: { items: Item[] }) {
  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedItemId);

  return (
    <div className="space-y-6">
      <div className="flex justify-end"></div>

      <ItemsToolbar
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="rounded-xl border p-6">
        view: {view} / search: {search}
      </div>

      <ItemsTable
        items={items}
        onEdit={(itemId) => console.log("edit", itemId)}
        onDelete={(itemId) => console.log("delete", itemId)}
      />
    </div>
  );
}
