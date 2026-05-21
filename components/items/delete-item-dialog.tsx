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

type DeleteItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
  } | null;
  onSubmit: (values: { itemId: string }) => Promise<void>;
};

export function DeleteItemDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: DeleteItemDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!item) return;

    setLoading(true);

    await onSubmit({
      itemId: item.id,
    });

    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{item?.name}</span>?
          </DialogDescription>
        </DialogHeader>

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
