"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { formatPriceToUnit } from "@/lib/utils/format";

type AddPriceDialogProps = {
  itemName: string;
  onSubmit: (values: { price: number }) => void;
  children: React.ReactNode;
};

export function AddPriceDialog({
  itemName,
  onSubmit,
  children,
}: AddPriceDialogProps) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPrice("");
  };

  const handleSubmit = async () => {
    const parsedPrice = Number(price);

    if (!parsedPrice || parsedPrice <= 0) return;

    setLoading(true);

    await onSubmit({
      price: parsedPrice,
    });

    setLoading(false);
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setPrice("");
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Price Record</DialogTitle>
          <DialogDescription>{itemName}</DialogDescription>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
