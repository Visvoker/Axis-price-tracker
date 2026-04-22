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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddPriceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onSubmit: (values: { price: number }) => void;
};

export function AddPriceDialog({
  open,
  onOpenChange,
  itemName,
  onSubmit,
}: AddPriceDialogProps) {
  const [price, setPrice] = useState("");

  function handleSubmit() {
    const parsedPrice = Number(price);

    if (!parsedPrice || parsedPrice < 0) return;

    onSubmit({
      price: parsedPrice,
    });

    setPrice("");
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setPrice("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Price Record</DialogTitle>
          <DialogDescription>{itemName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
