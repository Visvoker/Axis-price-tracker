"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type PriceHistory = {
  id: string;
  price: number;
  createdAt: string;
  createdBy?: { name: string | null } | null;
};

type PriceHistoryTableProps = {
  prices: PriceHistory[];
};

export function PriceHistoryTable({ prices }: PriceHistoryTableProps) {
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

              <TableCell className="text-right">123</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
