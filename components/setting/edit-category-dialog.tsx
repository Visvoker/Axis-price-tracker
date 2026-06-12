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

type EditCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: {
    id: string;
    name: string;
  } | null;
  onSubmit: (values: { categoryId: string; name: string }) => Promise<void>;
};

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
}: EditCategoryDialogProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category) return;
    if (!name.trim()) return;

    setLoading(true);

    try {
      await onSubmit({
        categoryId: category.id,
        name: name.trim(),
      });

      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="edit-category-name">Category Name</Label>
          <Input
            id="edit-category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
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
