"use client";

import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { NumericFormat } from "react-number-format";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GroupedSelect } from "@/components/grouped-select";

import { cn } from "@/lib/utils";
import { formatPriceToUnit } from "@/lib/utils/format";
import { getItemsForPriceSelect } from "@/lib/actions/item";

type QuickAddPriceDialogProps = {
  groupId: string;
  onSubmit: (values: { itemId: string; price: number }) => Promise<void>;
};

type ItemOption = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  } | null;
};

export function QuickAddPriceDialog({
  groupId,
  onSubmit,
}: QuickAddPriceDialogProps) {
  const [price, setPrice] = useState("");
  const [items, setItems] = useState<ItemOption[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  const [open, setOpen] = useState(false);

  const loadItems = async () => {
    setLoadingItems(true);

    try {
      const result = await getItemsForPriceSelect(groupId);
      setItems(result);
    } catch (error) {
      console.error("loadItems error:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  const groupedItemOptions = Object.values(
    items.reduce(
      (groups, item) => {
        const categoryName = item.category?.name ?? "未分類";

        if (!groups[categoryName]) {
          groups[categoryName] = {
            label: categoryName,
            options: [],
          };
        }

        groups[categoryName].options.push({
          label: item.name,
          value: item.id,
        });

        return groups;
      },
      {} as Record<
        string,
        {
          label: string;
          options: { label: string; value: string }[];
        }
      >,
    ),
  );

  const resetForm = () => {
    setSelectedItemId("");
    setPrice("");
  };

  const handleSubmit = async () => {
    const parsedPrice = Number(price);

    if (!selectedItemId) return;
    if (!parsedPrice || parsedPrice <= 0) return;

    setSaving(true);

    try {
      await onSubmit({
        itemId: selectedItemId,
        price: parsedPrice,
      });

      resetForm();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={async (nextOpen) => {
          setOpen(nextOpen);

          if (nextOpen && items.length === 0) {
            await loadItems();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <CirclePlus className="size-4" />
            Price
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg flex flex-col justify-between center">
              <p className="flex-1">Add Price Record</p>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label>
              Item
              <span className="text-xs text-muted-foreground">
                總數: {items.length}
              </span>
            </Label>

            <GroupedSelect
              value={selectedItemId}
              options={groupedItemOptions}
              onChange={(value) => {
                setSelectedItemId(value ?? "");
              }}
              placeholder="Search and select item"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <NumericFormat
              customInput={Input}
              className={cn(price && "tracking-wider")}
              thousandSeparator=","
              allowNegative={false}
              value={price}
              onValueChange={(values) => setPrice(values.value)}
              placeholder="Enter price"
            />

            {price && (
              <p className="text-md text-muted-foreground">
                = {formatPriceToUnit(price)}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={loadingItems || saving || !price || !selectedItemId}
            >
              {loadingItems ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
