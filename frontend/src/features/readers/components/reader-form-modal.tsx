import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { readerSchema, type ReaderFormValues } from "@/schemas/reader/reader.schema";
import type { Reader } from "@/types/reader/reader.entity";
import { readerService } from "../reader.service";
import { ConfirmationModal } from "@/components/ui/confirmation-modal/confirmation-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReaderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedReader: Reader | null;
}

export const ReaderFormModal: React.FC<ReaderFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedReader,
}) => {
  const form = useForm<ReaderFormValues>({
    resolver: zodResolver(readerSchema),
    defaultValues: {
      name: "",
      email: "",
      borrowLimit: 5,
    },
  });

  useEffect(() => {
    if (selectedReader) {
      form.reset({
        name: selectedReader.name,
        email: selectedReader.email,
        borrowLimit: selectedReader.borrowLimit,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        borrowLimit: 5,
      });
    }
  }, [selectedReader, form, isOpen]);

  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);

  const onSubmit: SubmitHandler<ReaderFormValues> = async (values) => {
    try {
      if (selectedReader) {
        if (values.borrowLimit < selectedReader.currentBorrowCount) {
          form.setError("borrowLimit", {
            message: `Limit cannot be less than current borrowed count (${selectedReader.currentBorrowCount})`,
          });
          return;
        }
        await readerService.updateReader(selectedReader.id, values);
        toast.success("Reader updated successfully");
      } else {
        await readerService.createReader(values);
        toast.success("Reader created successfully");
      }
      form.reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save reader");
    }
  };

  const handleClose = () => {
    if (form.formState.isDirty) {
      setIsConfirmExitOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    setIsConfirmExitOpen(false);
    form.reset();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedReader ? "Edit Reader" : "Add New Reader"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField<ReaderFormValues>
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reader name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<ReaderFormValues>
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="reader@example.com" {...field} disabled={!!selectedReader} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<ReaderFormValues>
                control={form.control}
                name="borrowLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Borrow Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={isConfirmExitOpen}
        onClose={() => setIsConfirmExitOpen(false)}
        onConfirm={handleConfirmExit}
        title="Discard Changes"
        description="You have unsaved changes. Are you sure you want to discard them and leave?"
        confirmText="Discard"
        cancelText="Stay"
        variant="destructive"
      />
    </>
  );
};
