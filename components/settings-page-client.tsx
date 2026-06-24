"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCategoryDialog } from "@/components/setting/edit-category-dialog";
import { CreateCategoryDialog } from "@/components/setting/create-category-dialog";
import { DeleteCategoryDialog } from "@/components/setting/delete-category-dialog";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/category";
import { TablePagination } from "./table-pagination";

type SettingsPageClientProps = {
  categories: Category[];
  groupId: string;
};

type Category = {
  id: string;
  name: string;
};

export function SettingsPageClient({
  categories,
  groupId,
}: SettingsPageClientProps) {
  const [search, setSearch] = useState("");
  const [creatingCategoryOpen, setCreatingCategoryOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();
  const editingCategory =
    categories.find((category) => category.id === editingCategoryId) ?? null;
  const deletingCategory =
    categories.find((category) => category.id === deletingCategoryId) ?? null;

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCategories = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalCategories / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Category Management</CardTitle>
          <div>
            <Button
              onClick={() => {
                setCreatingCategoryOpen(true);
              }}
            >
              +
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search category ..."
              className="pl-9"
            />
          </div>

          {paginatedCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <p className="font-medium">{category.name}</p>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCategoryId(category.id)}
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => setDeletingCategoryId(category.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            totalItems={totalCategories}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </CardContent>
      </Card>

      <CreateCategoryDialog
        open={creatingCategoryOpen}
        onOpenChange={setCreatingCategoryOpen}
        onSubmit={async (values) => {
          try {
            await createCategory({
              groupId,
              name: values.name,
            });

            toast.success("Category created");
            setCreatingCategoryOpen(false);
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to create category",
            );

            throw error;
          }
        }}
      />

      <EditCategoryDialog
        key={editingCategory?.id ?? "empty"}
        open={!!editingCategoryId}
        onOpenChange={(open) => {
          if (!open) setEditingCategoryId(null);
        }}
        category={editingCategory}
        onSubmit={async (values) => {
          try {
            await updateCategory({
              groupId,
              categoryId: values.categoryId,
              name: values.name,
            });

            toast.success("Category updated");
            setEditingCategoryId(null);
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to update category",
            );

            throw error;
          }
        }}
      />

      <DeleteCategoryDialog
        key={deletingCategory?.id}
        open={!!deletingCategoryId}
        onOpenChange={(open) => {
          if (!open) setDeletingCategoryId(null);
        }}
        category={deletingCategory}
        onSubmit={async (values) => {
          try {
            await deleteCategory({
              groupId,
              categoryId: values.categoryId,
            });

            toast.success("Category deleted");
            setDeletingCategoryId(null);
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to delete category",
            );

            throw error;
          }
        }}
      />
    </>
  );
}
