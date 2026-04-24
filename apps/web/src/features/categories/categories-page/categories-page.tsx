import React, { useState } from "react";
import { CategoryTable } from "../category-table/category-table";
import { CategoryFormModal } from "../category-form-modal/category-form-modal";
import { categoryService } from "../category.service";
import type { CategoryEntity } from "@/types/category/category.entity";
import { toast } from "sonner";
import { ErrorCode } from "@qltv/shared";

import { useDataTable } from "@/hooks/use-data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const CategoriesPage: React.FC = () => {
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

  // Delete State
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryEntity | null>(null);
  
  // Bulk Delete State
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  
  const [isDeleting, setIsDeleting] = useState(false);

  // Data Table Hook
  const {
    data: categories,
    loading: isLoading,
    page,
    totalPages,
    limit,
    total,
    search,
    setSearch,
    setPage,
    setLimit,
    refresh,
  } = useDataTable<CategoryEntity>({
    fetchData: categoryService.getAllCategories,
    initialLimit: 10,
  });

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: CategoryEntity) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: CategoryEntity) => {
    setCategoryToDelete(category);
    setIsDeleteAlertOpen(true);
  };

  const handleBulkDeleteClick = (ids: string[]) => {
    setIdsToDelete(ids);
    setIsBulkDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      const response = await categoryService.deleteCategory(categoryToDelete.id);
      if (response.code === 0 || response.code === ErrorCode.SUCCESS) {
        toast.success("Category deleted successfully");
        setIsDeleteAlertOpen(false);
        refresh();
      }
    } catch (error: any) {
      if (error.code === 400402) {
        toast.error("Cannot delete this category because it contains books.");
      } else {
        toast.error(error.message || "Error deleting category");
      }
      setIsDeleteAlertOpen(false);
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (idsToDelete.length === 0) return;
    setIsDeleting(true);
    try {
      const response = await categoryService.bulkDeleteCategories(idsToDelete);
      if (response.code === 0 || response.code === ErrorCode.SUCCESS) {
        toast.success(`Successfully deleted ${idsToDelete.length} categories`);
        setIsBulkDeleteAlertOpen(false);
        refresh();
      }
    } catch (error: any) {
      if (error.code === 400402) {
        toast.error("Cannot delete: Some categories contain books.");
      } else {
        toast.error(error.message || "Error during bulk delete");
      }
    } finally {
      setIsDeleting(false);
      setIdsToDelete([]);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">Manage book categories and classification codes in the library.</p>
        </div>
      </div>

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        limit={limit}
        total={total}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onEdit={handleEditCategory}
        onDelete={handleDeleteClick}
        onAdd={handleAddCategory}
        onBulkDelete={handleBulkDeleteClick}
      />

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          refresh();
        }}
        selectedCategory={selectedCategory}
      />

      {/* Single Delete Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Category
              <strong> "{categoryToDelete?.name}"</strong> will be permanently removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Alert */}
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm delete {idsToDelete.length} categories?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {idsToDelete.length} categories at once. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmBulkDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Confirm Bulk Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

