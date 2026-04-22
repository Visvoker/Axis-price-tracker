"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Item = {
  id: string;
  name: string;
  latestPrice: number | null;
  updatedAt: string;
};

type ItemsTableProps = {
  items: Item[];
  onAddPrice: (itemId: string) => void;
  onEdit: (itemId: string) => void;
  onDelete: (itemId: string) => void;
};

export function ItemsTable({
  items,
  onAddPrice,
  onDelete,
  onEdit,
}: ItemsTableProps) {
  return (
    <div className="rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Latest Price</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {/* Name */}
              <TableCell className="font-medium">{item.name}</TableCell>

              {/* Latest Price */}
              <TableCell>
                {item.latestPrice
                  ? `${item.latestPrice.toLocaleString()}`
                  : "-"}
              </TableCell>

              {/* Last Updated */}
              <TableCell className="text-muted-foreground">
                {item.updatedAt}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" onClick={() => onAddPrice(item.id)}>
                    + Price
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
