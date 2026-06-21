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

type DeletePriceRecordsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceRecord: {
    id: string;
  } | null;
  onSubmit: (values: { priceRecordId: string }) => Promise<void>;
};

export function DeletePriceRecordsDialog({
  open,
  onOpenChange,
  priceRecord,
  onSubmit,
}: DeletePriceRecordsDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!priceRecord) return;

    setLoading(true);

    await onSubmit({
      priceRecordId: priceRecord.id,
    });

    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Price</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete ?
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
