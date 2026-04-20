import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label/label";
import { categoryService } from "../category.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { CategoryEntity } from "@/types/category/category.entity";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedCategory?: CategoryEntity | null;
}

const removeAccents = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const generateSlug = (name: string) => {
  return removeAccents(name)
    .toUpperCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "");
};

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedCategory,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualCode, setIsManualCode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const watchedName = watch("name");

  // Auto-generate code if not manually edited
  useEffect(() => {
    if (!isManualCode && !selectedCategory && watchedName) {
      setValue("code", generateSlug(watchedName));
    }
  }, [watchedName, isManualCode, setValue, selectedCategory]);

  useEffect(() => {
    if (isOpen) {
      if (selectedCategory) {
        reset({
          name: selectedCategory.name,
          code: selectedCategory.code || "",
        });
        setIsManualCode(true);
      } else {
        reset({
          name: "",
          code: "",
        });
        setIsManualCode(false);
      }
    }
  }, [isOpen, selectedCategory, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, data);
        toast.success("Category updated successfully");
      } else {
        await categoryService.createCategory(data);
        toast.success("Category created successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Science Fiction"
              {...register("name")}
              autoFocus
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Category Code *</Label>
            <Input
              id="code"
              placeholder="e.g. SCI-FI"
              {...register("code")}
              onChange={(e) => {
                setIsManualCode(true);
                setValue("code", e.target.value.toUpperCase());
              }}
            />
            <p className="text-[10px] text-muted-foreground">
              {isManualCode ? "Manual entry mode" : "Auto-generating from name..."}
            </p>
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedCategory ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
