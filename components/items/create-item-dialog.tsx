"use client";

import { useState, useRef, type SubmitEvent } from "react";
import toast from "react-hot-toast";
import { CirclePlus } from "lucide-react";
import { NumericFormat } from "react-number-format";

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
import { CreatableSelect } from "@/components/creatable-select";

import { cn } from "@/lib/utils";
import { formatPriceToUnit } from "@/lib/utils/format";
import { createCategory } from "@/lib/actions/category";

type CreateItemDialogProps = {
  groupId: string;
  categories: {
    id: string;
    name: string;
  }[];
  onSubmit: (values: {
    name: string;
    category?: string;
    price?: number;
  }) => Promise<void>;
};

export function CreateItemDialog({
  onSubmit,
  groupId,
  categories,
}: CreateItemDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");

  const [categoryOptions, setCategoryOptions] = useState(categories);

  const priceInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
  };

  const handleSubmit = async (e?: SubmitEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = Number(price);

    setError("");
    setLoading(true);

    try {
      await onSubmit({
        name: name.trim(),
        category: category || undefined,
        price: parsedPrice > 0 ? parsedPrice : undefined,
      });

      toast.success("物品創建成功 !");
      resetForm();
      setOpen(false);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Item name already exists"
      ) {
        setError("這個品項名稱已經存在");
      } else {
        setError("建立品項失敗，請稍後再試");
      }
    } finally {
      setLoading(false);
    }
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

      <DialogContent className="max-w-sm sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>

            <CreatableSelect
              value={category}
              options={categoryOptions.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              onChange={(value) => {
                setCategory(value ?? "");

                requestAnimationFrame(() => {
                  priceInputRef.current?.focus();
                });
              }}
              onCreate={async (value) => {
                try {
                  const newCategory = await createCategory({
                    groupId,
                    name: value,
                  });

                  setCategoryOptions((prev) => [...prev, newCategory]);

                  setCategory(newCategory.id);

                  requestAnimationFrame(() => {
                    priceInputRef.current?.focus();
                  });
                  toast.success("Category created");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Failed to create category",
                  );
                }
              }}
              placeholder="Select or create category"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Current Price</Label>
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
              getInputRef={priceInputRef}
            />

            {price && (
              <p className="flex items-center text-md text-muted-foreground">
                = {formatPriceToUnit(price)}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
