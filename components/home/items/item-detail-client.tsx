"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PriceChart } from "@/components/items/price-chart";
import { PriceHistoryTable } from "@/components/items/price-history-table";
import { Button } from "@/components/ui/button";
import { AddPriceDialog } from "@/components/items/add-price-dialog";
import {
  createPriceRecord,
  deletePriceRecord,
  updatePriceRecord,
} from "@/lib/actions/price";
import { EditPriceRecordsDialog } from "@/components/price/edit-price-records-dialog";
import { DeletePriceRecordsDialog } from "@/components/price/delete-price-records-dialog";
import toast from "react-hot-toast";

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
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [deletingPriceId, setDeletingPriceId] = useState<string | null>(null);

  const editingPrice =
    item.prices.find((price) => price.id === editingPriceId) ?? null;
  const deletingPrice =
    item.prices.find((price) => price.id === deletingPriceId) ?? null;

  const chartData = [...item.prices].reverse().map((p) => ({
    price: p.price,
    date: p.createdAt,
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

      <PriceHistoryTable
        prices={item.prices}
        onEdit={setEditingPriceId}
        onDelete={setDeletingPriceId}
      />

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
