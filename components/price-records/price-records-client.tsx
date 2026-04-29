"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PriceChart } from "@/components/items/price-chart";
import { AddPriceDialog } from "@/components/items/add-price-dialog";
import { PriceHistoryTable } from "@/components/items/price-history-table";

import {
  createPriceRecord,
  getItemWithPricesAction,
} from "@/lib/actions/price";
import { useRouter } from "next/navigation";

type ItemOption = {
  id: string;
  name: string;
  category: string | null;
};

type PriceRecordsClientProps = {
  groupId: string;
  items: ItemOption[];
};

type SelectedItemData = {
  id: string;
  name: string;
  category: string | null;
  prices: {
    id: string;
    price: number;
    createdAt: string;
    createdBy?: { name: string | null } | null;
  }[];
};

export function PriceRecordsClient({
  groupId,
  items,
}: PriceRecordsClientProps) {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [selectedItemData, setSelectedItemData] =
    useState<SelectedItemData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addPriceOpen, setAddPriceOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const value = keyword.trim().toLowerCase();

    if (!value) return [];

    return items.filter((item) => item.name.toLowerCase().includes(value));
  }, [items, keyword]);

  async function handleSelectItem(itemId: string) {
    setIsLoading(true);

    const data = await getItemWithPricesAction(itemId, groupId);

    setSelectedItemData(data);
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Price Records</h1>
        <p className="text-sm text-muted-foreground">
          Search an item to view its price trends and history.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Search Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search item name..."
              className="pl-9"
            />
          </div>

          {filteredItems.length > 0 && (
            <div className="absolute z-10 mt-1 relative max-w-md rounded-md border bg-background shadow">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleSelectItem(item.id);
                    setKeyword("");
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.category ?? "No category"}
                  </span>
                </button>
              ))}
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
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium">No item selected</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Search and select an item to view its price chart.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">
                {selectedItemData.name}
              </CardTitle>

              <div>
                <AddPriceDialog
                  itemName={selectedItemData.name}
                  onSubmit={async (values) => {
                    await createPriceRecord({
                      itemId: selectedItemData.id,
                      price: values.price,
                    });

                    router.refresh();
                  }}
                >
                  <Button size="sm">+</Button>
                </AddPriceDialog>
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
          <PriceHistoryTable prices={selectedItemData.prices} />
        </div>
      )}
    </div>
  );
}
