"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPriceToUnit } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";

type EditPriceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceRecord: {
    id: string;
    price: number;
  } | null;
  onSubmit: (values: { id: string; price: number }) => Promise<void>;
};

export function EditPriceRecordsDialog({
  open,
  onOpenChange,
  priceRecord,
  onSubmit,
}: EditPriceDialogProps) {
  const [price, setPrice] = useState(priceRecord?.price?.toString() ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!priceRecord) return;
    if (!price || Number(price) <= 0) return;

    setLoading(true);

    await onSubmit({
      id: priceRecord?.id,
      price: Number(price),
    });

    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Price</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="edit-name"></Label>
          <NumericFormat
            customInput={Input}
            className={cn(price && "tracking-wider")}
            thousandSeparator=","
            allowNegative={false}
            value={price}
            onValueChange={(values) => {
              setPrice(values.value);
            }}
            placeholder="Enter price"
          />
          {price && (
            <p className="flex items-center text-md text-muted-foreground">
              = {formatPriceToUnit(price)}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || Number(price) <= 0}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
