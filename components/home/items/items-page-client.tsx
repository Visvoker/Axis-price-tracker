"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ItemsToolbar } from "./items-toolbar";

import { ItemsTable } from "@/components/items/items-table";
import { AddPriceDialog } from "@/components/items/add-price-dialog";
import { EditItemDialog } from "@/components/items/edit-item-dialog";
import { DeleteItemDialog } from "@/components/items/delete-item-dialog";

import { createPriceRecord } from "@/lib/actions/price";
import { deleteItem, updateItem } from "@/lib/actions/item";

type CategoryOption = {
  id: string;
  name: string;
};

type Item = {
  id: string;
  name: string;
  latestPrice: number | null;
  updatedAt: string;
  currentCategory: CategoryOption | null;
};

type ItemsPageClientProps = {
  groupId: string;
  items: Item[];
  categoryOptions: CategoryOption[];
};

export function ItemsPageClient({
  items,
  groupId,
  categoryOptions,
}: ItemsPageClientProps) {
  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [addingPriceItemId, setAddingPriceItemId] = useState<string | null>(
    null,
  );
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const router = useRouter();

  const addingPriceItem =
    items.find((item) => item.id === addingPriceItemId) ?? null;
  const editingItem = items.find((item) => item.id === editingItemId) ?? null;
  const deletingItem = items.find((item) => item.id === deletingItemId) ?? null;

  return (
    <div className="space-y-6 pt-2 min-h-0 overflow-y-auto">
      <ItemsToolbar
        view={view}
        search={search}
        onViewChange={setView}
        onSearchChange={setSearch}
      />

      <ItemsTable
        items={items}
        onEdit={setEditingItemId}
        onDelete={setDeletingItemId}
        onAddPrice={setAddingPriceItemId}
      />

      <AddPriceDialog
        open={!!addingPriceItemId}
        onOpenChange={(open) => {
          if (!open) setAddingPriceItemId(null);
        }}
        item={addingPriceItem}
        onSubmit={async (values) => {
          await createPriceRecord({
            itemId: values.itemId,
            price: values.price,
          });

          setAddingPriceItemId(null);
          router.refresh();
        }}
      />

      <EditItemDialog
        key={editingItem?.id ?? "empty"}
        open={!!editingItemId}
        onOpenChange={(open) => {
          if (!open) setEditingItemId(null);
        }}
        item={editingItem}
        categoryOptions={categoryOptions}
        onSubmit={async (values) => {
          await updateItem({
            groupId,
            itemId: values.itemId,
            name: values.name,
            categoryId: values.categoryId,
          });

          setEditingItemId(null);
          router.refresh();
        }}
      />

      <DeleteItemDialog
        open={!!deletingItemId}
        onOpenChange={(open) => {
          if (!open) setDeletingItemId(null);
        }}
        item={deletingItem}
        onSubmit={async (values) => {
          await deleteItem({
            groupId,
            itemId: values.itemId,
          });

          setDeletingItemId(null);
          router.refresh();
        }}
      />
    </div>
  );
}
