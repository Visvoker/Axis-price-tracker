"use client";

import { useState } from "react";

import { ItemsTable } from "@/components/items/items-table";

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

  return (
    <div className="space-y-6 pt-2 min-h-0 overflow-y-auto">
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
