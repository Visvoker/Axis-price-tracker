"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

type PriceHistory = {
  id: string;
  price: number;
  createdAt: string;
  createdBy?: { name: string | null } | null;
};

type PriceHistoryTableProps = {
  prices: PriceHistory[];
  onEdit: (editingPriceId: string) => void;
  onDelete: (deletingPriceId: string) => void;
};

export function PriceHistoryTable({
  prices,
  onEdit,
  onDelete,
}: PriceHistoryTableProps) {
  if (!prices.length) {
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        No price records yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Price</TableHead>
            <TableHead className="text-right">Recorded By</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {prices.map((p) => (
            <TableRow key={p.id}>
              {/* Price */}
              <TableCell>{Number(p.price).toLocaleString()}</TableCell>

              {/* User */}
              <TableCell className="text-right">
                {p.createdBy?.name ?? "-"}
              </TableCell>

              <TableCell className="text-muted-foreground text-right ">
                {new Date(p.createdAt).toLocaleString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Taipei",
                })}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(p.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(p.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
