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

type DeleteCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: {
    id: string;
    name: string;
  } | null;
  onSubmit: (values: { categoryId: string }) => Promise<void>;
};

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
}: DeleteCategoryDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category) return;

    setLoading(true);

    try {
      await onSubmit({
        categoryId: category.id,
      });

      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground text-xl">
            {category?.name}
          </span>{" "}
          ?
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
