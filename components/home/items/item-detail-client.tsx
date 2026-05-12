"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AddPriceDialog } from "@/components/items/add-price-dialog";
import { PriceHistoryTable } from "@/components/items/price-history-table";
import { createPriceRecord } from "@/lib/actions/price";
import { PriceChart } from "@/components/items/price-chart";

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
  const [addPriceOpen, setAddPriceOpen] = useState(false);

  const chartData = [...item.prices].reverse().map((p) => ({
    date: p.createdAt,
    price: p.price,
  }));

  return (
    <div className="space-y-6 items-center ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{item.name}</h1>
        <Button onClick={() => setAddPriceOpen(true)}>+ Add Price</Button>
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
        open={addPriceOpen}
        onOpenChange={setAddPriceOpen}
        itemName={item.name}
        onSubmit={async (values) => {
          await createPriceRecord({
            itemId: item.id,
            price: values.price,
          });

          router.refresh();
        }}
      />
    </div>
  );
}
