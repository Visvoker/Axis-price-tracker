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
import { TablePagination } from "@/components/table-pagination";

type categories = {
  id: string;
  name: string;
};

type Item = {
  id: string;
  name: string;
  latestPrice: number | null;
  updatedAt: string;
  currentCategory: categories | null;
};

type ItemsPageClientProps = {
  groupId: string;
  items: Item[];
  categories: categories[];
};

export function ItemsPageClient({
  items,
  groupId,
  categories,
}: ItemsPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [addingPriceItemId, setAddingPriceItemId] = useState<string | null>(
    null,
  );
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();

  const normalizedSearch = search.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.name.toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      selectedCategoryId === "all" ||
      item.currentCategory?.id === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const addingPriceItem =
    items.find((item) => item.id === addingPriceItemId) ?? null;
  const editingItem = items.find((item) => item.id === editingItemId) ?? null;
  const deletingItem = items.find((item) => item.id === deletingItemId) ?? null;

  const hasItems = items.length > 0;
  const hasFilteredItems = filteredItems.length > 0;

  return (
    <div className="space-y-6 pt-2 min-h-0 overflow-y-auto">
      <ItemsToolbar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={(value) => {
          setSelectedCategoryId(value);
          setCurrentPage(1);
        }}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
      />

      {!hasItems ? (
        <div className="flex min-h-40 items-center justify-center rounded-lg border text-center">
          <p className="text-sm text-muted-foreground">
            目前還沒有商品，新增第一個商品後就能開始記錄價格。
          </p>
        </div>
      ) : !hasFilteredItems ? (
        <div className="flex min-h-40 items-center justify-center rounded-lg border text-center">
          <p className="text-sm text-muted-foreground">
            找不到符合條件的商品，請調整搜尋或分類篩選。
          </p>
        </div>
      ) : (
        <>
          <ItemsTable
            items={paginatedItems}
            onEdit={setEditingItemId}
            onDelete={setDeletingItemId}
            onAddPrice={setAddingPriceItemId}
          />

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </>
      )}

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
        categories={categories}
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
        groupId={groupId}
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
