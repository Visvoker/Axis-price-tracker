"use client";

import { useEffect, useState } from "react";

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
import { Select } from "../select";

type CategoryOption = {
  id: string;
  name: string;
};

type EditItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
    currentCategory: CategoryOption | null;
  } | null;
  categoryOptions: CategoryOption[];
  onSubmit: (values: {
    itemId: string;
    name: string;
    categoryId?: string;
  }) => Promise<void>;
};

export function EditItemDialog({
  open,
  onOpenChange,
  item,
  categoryOptions,
  onSubmit,
}: EditItemDialogProps) {
  const [name, setName] = useState(item?.name ?? "");
  const [categoryId, setCategoryId] = useState(item?.currentCategory?.id ?? "");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setCategoryId("");
  };

  const handleSubmit = async () => {
    if (!item) return;
    if (!name.trim()) return;

    setLoading(true);

    await onSubmit({
      itemId: item.id,
      name: name.trim(),
      categoryId: categoryId || undefined,
    });

    setLoading(false);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="edit-name">Item Name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-category">Category</Label>
          <Select
            value={categoryId}
            options={categoryOptions.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            onChange={(value) => {
              setCategoryId(value ?? "");
            }}
            placeholder="Select category"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
