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

type EditItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
    category?: string | null;
  } | null;
  onSubmit: (values: {
    itemId: string;
    name: string;
    category?: string;
  }) => Promise<void>;
};

export function EditItemDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: EditItemDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setCategory("");
  };

  const fillForm = () => {
    setName(item?.name ?? "");
    setCategory(item?.category ?? "");
  };

  const handleSubmit = async () => {
    if (!item) return;
    if (!name.trim()) return;

    setLoading(true);

    await onSubmit({
      itemId: item.id,
      name: name.trim(),
      category: category.trim() || undefined,
    });

    setLoading(false);
    onOpenChange(false);
  };

  // test

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          fillForm();
        } else {
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
          <Label htmlFor="edit-category">Category (optional)</Label>
          <Input
            id="edit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Potion, Scroll"
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
