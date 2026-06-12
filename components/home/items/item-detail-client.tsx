"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PriceChart } from "@/components/items/price-chart";
import { PriceHistoryTable } from "@/components/items/price-history-table";
import { Button } from "@/components/ui/button";
import { AddPriceDialog } from "@/components/items/add-price-dialog";
import { createPriceRecord } from "@/lib/actions/price";

type ItemDetailClientProps = {
  item: {
    id: string;
    name: string;
    category: string | null;
    latestPrice: number | null;
    totalRecords: number;
    prices: {
      id: string;
      price: number;
      createdAt: string;
      createdBy: {
        name: string | null;
      };
    }[];
  };
};

export default function ItemDetailClient({ item }: ItemDetailClientProps) {
  const router = useRouter();
  const [addingPriceOpen, setAddingPriceOpen] = useState(false);

  const chartData = [...item.prices].reverse().map((p) => ({
    date: p.createdAt,
    price: p.price,
  }));

  if (!item) {
    return null;
  }

  return (
    <div className="space-y-6 items-center pt-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{item.name}</h1>
        <Button onClick={() => setAddingPriceOpen(true)}>+ Add Price</Button>
      </div>

      <div className="space-y-2 rounded-xl border p-4 ">
        <div>Category: {item.category ?? "-"}</div>
        <div>
          Latest Price:{" "}
          {item.latestPrice ? item.latestPrice.toLocaleString() : "-"}
        </div>
        <div>Total Records: {item.totalRecords}</div>
      </div>

      <PriceChart data={chartData} />

      <PriceHistoryTable prices={item.prices} />

      <AddPriceDialog
        open={addingPriceOpen}
        onOpenChange={setAddingPriceOpen}
        item={{
          id: item.id,
          name: item.name,
        }}
        onSubmit={async (values) => {
          await createPriceRecord({
            itemId: values.itemId,
            price: values.price,
          });

          setAddingPriceOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}
