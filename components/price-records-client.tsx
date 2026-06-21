"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PriceChart } from "@/components/items/price-chart";
import { AddPriceDialog } from "@/components/items/add-price-dialog";
import { PriceHistoryTable } from "@/components/items/price-history-table";

import {
  createPriceRecord,
  deletePriceRecord,
  updatePriceRecord,
} from "@/lib/actions/price";
import { useRouter } from "next/navigation";
import { EditPriceRecordsDialog } from "./price/edit-price-records-dialog";
import toast from "react-hot-toast";
import { DeletePriceRecordsDialog } from "./price/delete-price-records-dialog";

type ItemOption = {
  id: string;
  name: string;
  category: {
    name: string;
    id: string;
  };
};

type SelectedItemData = {
  id: string;
  name: string;
  category: {
    name: string;
    id: string;
  };
  prices: {
    id: string;
    price: number;
    createdAt: string;
    createdBy?: { name: string | null } | null;
  }[];
};
type PriceRecordsClientProps = {
  groupId: string;
  items: ItemOption[];
  initialSelectedItem: SelectedItemData | null;
};

export function PriceRecordsClient({
  groupId,
  items,
  initialSelectedItem,
}: PriceRecordsClientProps) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addingPriceOpen, setAddingPriceOpen] = useState(false);
  const [recentItems, setRecentItems] = useState<ItemOption[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [deletingPriceId, setDeletingPriceId] = useState<string | null>(null);

  const editingPrice =
    initialSelectedItem?.prices.find((price) => price.id === editingPriceId) ??
    null;

  const deletingPrice =
    initialSelectedItem?.prices.find((price) => price.id === deletingPriceId) ??
    null;

  const router = useRouter();
  const selectedItemData = initialSelectedItem;

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return [];

    return items.filter((item) => item.name.toLowerCase().includes(value));
  }, [items, search]);

  async function handleSelectItem(item: ItemOption) {
    setSearch("");

    setRecentItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);

      if (exists) {
        return prev;
      }

      return [...prev, item].slice(-8);
    });

    router.push(`/${groupId}/price-records?itemId=${item.id}`);
  }

  useEffect(() => {
    const saved = localStorage.getItem(`recentItems-${groupId}`);

    if (saved) {
      setRecentItems(JSON.parse(saved));
    }

    setIsLoaded(true);
  }, [groupId]);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(`recentItems-${groupId}`, JSON.stringify(recentItems));
  }, [recentItems, groupId, isLoaded]);

  return (
    <div className="space-y-6 overflow-y-auto pt-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Price Records</h1>
        <p className="text-sm text-muted-foreground">
          Search an item to view its price trends and history.
        </p>
      </div>

      <Card className="ring-0 border overflow-visible">
        <CardContent className="space-y-2">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search item name..."
              className="pl-9"
            />
            {filteredItems.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-background shadow">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-chart-1"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.category?.name ?? "No category"}{" "}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {recentItems.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {recentItems.map((item) => (
                  <Button
                    key={item.id}
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSelectItem(item)}
                    className="hover:bg-chart-1"
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
            Loading price records...
          </CardContent>
        </Card>
      ) : !selectedItemData ? (
        <Card className="ring-0 border">
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium">No item selected</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Search and select an item to view its price chart.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 ">
          <Card className="ring-0 border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">
                {selectedItemData.name}
              </CardTitle>

              <div>
                <AddPriceDialog
                  open={addingPriceOpen}
                  onOpenChange={setAddingPriceOpen}
                  item={selectedItemData}
                  onSubmit={async (values) => {
                    await createPriceRecord({
                      itemId: selectedItemData.id,
                      price: values.price,
                    });

                    router.refresh();
                  }}
                />
                <Button onClick={() => setAddingPriceOpen(true)}>+</Button>
              </div>
            </CardHeader>
            <CardContent>
              <PriceChart
                data={[...selectedItemData.prices].reverse().map((price) => ({
                  date: price.createdAt,
                  price: price.price,
                }))}
              />
            </CardContent>
          </Card>

          <PriceHistoryTable
            prices={selectedItemData.prices}
            onEdit={setEditingPriceId}
            onDelete={setDeletingPriceId}
          />
        </div>
      )}

      <EditPriceRecordsDialog
        key={editingPrice?.id ?? "emptyE"}
        open={!!editingPriceId}
        onOpenChange={(open) => {
          if (!open) setEditingPriceId(null);
        }}
        priceRecord={editingPrice}
        onSubmit={async (values) => {
          try {
            await updatePriceRecord({
              priceRecordId: values.id,
              price: values.price,
            });

            toast.success("Price updated!");
            setEditingPriceId(null);
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Failed to update price",
            );

            throw error;
          }
        }}
      />

      <DeletePriceRecordsDialog
        key={deletingPrice?.id ?? "emptyD"}
        open={!!deletingPriceId}
        onOpenChange={(open) => {
          if (!open) setDeletingPriceId(null);
        }}
        priceRecord={deletingPrice}
        onSubmit={async (value) => {
          try {
            await deletePriceRecord({
              priceRecordId: value.priceRecordId,
            });
            toast.success("Price deleted!");
            setDeletingPriceId(null);
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Failed to delete price",
            );

            throw error;
          }
        }}
      />
    </div>
  );
}
