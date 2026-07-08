"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
};

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  rowsPerPage,
  startIndex,
  endIndex,
  onPageChange,
  onRowsPerPageChange,
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="pl-3 text-sm text-muted-foreground">
          {totalItems === 0 ? 0 : startIndex + 1}-
          {Math.min(endIndex, totalItems)} of {totalItems}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows per page</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => {
              onRowsPerPageChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="40">40</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.max(1, currentPage - 1));
                }}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.min(totalPages, currentPage + 1));
                }}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
