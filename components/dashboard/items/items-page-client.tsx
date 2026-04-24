"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AddPriceDialog } from "@/components/items/add-price-dialog";
import { CreateItemDialog } from "@/components/items/create-item-dialog";
import { ItemsTable } from "@/components/items/items-table";
import { createItem } from "@/lib/actions/item";
import { createPriceRecord } from "@/lib/actions/price";
import { ItemsToolbar } from "./items-toolbar";

type Item = {
  id: string;
  name: string;
  latestPrice: number | null;
  updatedAt: string;
};

export function ItemsPageClient({ items }: { items: Item[] }) {
  const router = useRouter();

  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const selectedItem = items.find((item) => item.id === selectedItemId);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          className="rounded-md bg-black px-4 py-2 text-white"
          onClick={() => setCreateOpen(true)}
        >
          Create Item
        </button>
      </div>

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

          router.refresh();
        }}
      />

      {/* Create Item */}
      <CreateItemDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (values) => {
          await createItem({
            name: values.name,
            category: values.category,
            price: values.price,
          });

          router.refresh();
        }}
      />
    </div>
  );
}
