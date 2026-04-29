"use client";

import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { formatPriceToUnit } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

type CreateItemDialogProps = {
  onSubmit: (values: {
    name: string;
    category?: string;
    price?: number;
  }) => Promise<void>;
};

export function CreateItemDialog({ onSubmit }: CreateItemDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const parsedPrice = Number(price);

    setLoading(true);

    await onSubmit({
      name: name.trim(),
      category: category || undefined,
      price: parsedPrice > 0 ? parsedPrice : undefined,
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
          resetForm();
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <CirclePlus className="size-4" />
          Create Item
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category (optional)</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Potion, Scroll"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Current Price (optional)</Label>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
