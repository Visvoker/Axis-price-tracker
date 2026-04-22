"use client";

import { useState } from "react";
import { ItemsToolbar } from "@/components/dashboard/items/items-toolbar";
import { ItemsTable } from "@/components/items/items-table";
import { AddPriceDialog } from "@/components/items/add-price-dialog";
import { createPriceRecord } from "@/lib/actions/price";

const mockItems = [
  {
    id: "1",
    name: "特殊藥水",
    latestPrice: 1200,
    updatedAt: "2026-04-22",
  },
  {
    id: "2",
    name: "礦泉水",
    latestPrice: 850,
    updatedAt: "2026-04-21",
  },
];

export default function ItemsPage() {
  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem = mockItems.find((item) => item.id === selectedItemId);

  return (
    <div className="space-y-6">
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
        items={mockItems}
        onAddPrice={(itemId) => setSelectedItemId(itemId)}
        onEdit={(itemId) => console.log("edit", itemId)}
        onDelete={(itemId) => console.log("delete", itemId)}
      />

      <AddPriceDialog
        open={!!selectedItem}
        onOpenChange={(open) => {
          if (!open) setSelectedItemId(null);
        }}
        itemName={selectedItem?.name ?? ""}
        onSubmit={async (values) => {
          await createPriceRecord({
            itemId: selectedItemId!,
            price: values.price,
          });
        }}
      />
    </div>
  );
}
