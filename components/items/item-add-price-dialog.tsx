"use client";

import { useState, type SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { formatPriceToUnit } from "@/lib/utils/format";
import toast from "react-hot-toast";

type ItemAddPriceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
  } | null;
  onSubmit: (values: { itemId: string; price: number }) => Promise<void>;
};

export function ItemAddPriceDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: ItemAddPriceDialogProps) {
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPrice("");
  };

  const handleSubmit = async (e?: SubmitEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!item) return;

    const parsedPrice = Number(price);

    if (!parsedPrice || parsedPrice <= 0) return;

    setLoading(true);

    await onSubmit({
      itemId: item.id,
      price: parsedPrice,
    });

    toast.success("新增價格成功 !");
    setLoading(false);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetForm();
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-sm sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Price Record</DialogTitle>
            <DialogDescription>{item?.name}</DialogDescription>
          </DialogHeader>
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
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading || !price}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
