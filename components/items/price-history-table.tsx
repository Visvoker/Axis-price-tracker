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
            <TableHead>Price</TableHead>
            <TableHead>Recorded By</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {prices.map((p) => (
            <TableRow key={p.id}>
              {/* Price */}
              <TableCell className="tabular-nums">
                {Number(p.price).toLocaleString()}
              </TableCell>

              {/* User */}
              <TableCell>{p.createdBy?.name ?? "-"}</TableCell>

              {/* Date */}

              {/* Uncaught Error: Hydration failed */}

              {/* <TableCell className="text-muted-foreground">
                {new Date(p.createdAt).toLocaleString()}
              </TableCell> */}

              <TableCell className="text-muted-foreground">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
