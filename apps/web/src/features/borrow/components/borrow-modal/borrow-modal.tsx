import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { Search, X, BookOpen, User, Calendar, Trash2, Plus, Loader2, Phone } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

import { borrowFormSchema, type BorrowFormValues } from "@/schemas/borrow/borrow.schema";
import { borrowService } from "../../borrow.service";
import { bookService } from "@/features/books/book.service";
import { readerService } from "@/features/readers/reader.service";
import { settingService as uiSettingService } from "@/features/settings/setting.service";
import { ErrorCode, SettingKey } from "@qltv/shared";
import type { Reader } from "@/types/reader/reader.entity";
import type { BookEntity } from "@/types/books/book.entity";

import { runRules } from "@qltv/shared";
import { borrowRuleSet } from "@qltv/shared";
import { getErrorMessage } from "@/constants/errors/error-map";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialReservation?: any;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialReservation,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [books, setBooks] = useState<BookEntity[]>([]);
  const [isNewUser, setIsNewUser] = useState(false);

  // Search states
  const [phoneSearch, setPhoneSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  // Selections
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [cart, setCart] = useState<BookEntity[]>([]);

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      userId: "",
      phone: "",
      bookIds: [],
      dueDate: addDays(new Date(), 14),
    },
  });

  // Fetch initial data
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          // Fetch readers, books and settings
          const [readersRes, booksRes, settingsRes] = await Promise.all([
            readerService.getReaders(),
            bookService.getBooks({ limit: 100, available: true }),
            uiSettingService.getAll()
          ]);

          if (readersRes.code === ErrorCode.SUCCESS && readersRes.data) setReaders(readersRes.data as Reader[]);
          if (booksRes.code === ErrorCode.SUCCESS && booksRes.data) setBooks(booksRes.data.items);
          
          // Apply dynamic borrow duration
          if (settingsRes.code === ErrorCode.SUCCESS && settingsRes.data) {
            const durationSetting = settingsRes.data.find((s: any) => s.key === SettingKey.BORROW_DURATION_DAYS);
            const days = durationSetting ? Number(durationSetting.value) : 14;
            form.setValue("dueDate", addDays(new Date(), days));
          }
        } catch (error) {
          console.error("Failed to fetch data for borrow modal", error);
        }
      };
      fetchData();

      // If initialReservation is provided, pre-fill reader and book
      if (initialReservation) {
        if (initialReservation.user) {
          const reader = initialReservation.user;
          setSelectedReader(reader);
          form.setValue("userId", reader.id);
          form.setValue("phone", reader.phoneRaw || reader.phoneNormalized || "");
        }
        if (initialReservation.book) {
          const book = initialReservation.book;
          setCart([book]);
          form.setValue("bookIds", [book.id]);
        }
        // Store reservationId in form if we add it to schema, 
        // or just pass it in onSubmit
      }
    } else {
      // Reset state on close
      setSelectedReader(null);
      setCart([]);
      setPhoneSearch("");
      setBookSearch("");
      form.reset();
    }
  }, [isOpen, form]);

  // Filtered lists
  const filteredReaders = useMemo(() => {
    if (!phoneSearch) return [];
    return readers.filter(r =>
      r.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(phoneSearch.toLowerCase())
    ).slice(0, 5);
  }, [readers, phoneSearch]);

  const filteredBooks = useMemo(() => {
    if (!bookSearch) return [];
    return books.filter(b =>
      (b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.callNumber?.toLowerCase().includes(bookSearch.toLowerCase())) &&
      !cart.some(item => item.id === b.id)
    ).slice(0, 5);
  }, [books, bookSearch, cart]);

  const validateBorrow = (reader: Reader | null, currentCart: BookEntity[], nextBook?: BookEntity) => {
    const nextCart = nextBook ? [...currentCart, nextBook] : currentCart;

    // Use default values for new guest users
    const userData = reader ? {
      id: reader.id,
      status: reader.status,
      currentBorrowCount: reader.currentBorrowCount,
      borrowLimit: reader.borrowLimit,
      hasOverdueBooks: reader.hasOverdueBooks
    } : {
      id: "guest",
      status: "ACTIVE" as any,
      currentBorrowCount: 0,
      borrowLimit: 5,
      hasOverdueBooks: false
    };

    const result = runRules(borrowRuleSet, {
      user: userData,
      books: nextCart.map(b => ({
        id: b.id,
        title: b.title,
        availableQuantity: b.availableQuantity
      })),
      hasOverdueBooks: userData.hasOverdueBooks
    });

    if (!result.ok) {
      toast.error(getErrorMessage(result.code));
      return false;
    }
    return true;
  };

  const handlePhoneLookup = async (phone: string) => {
    if (!phone || phone.length < 9) return;

    setIsLookupLoading(true);
    setIsNewUser(false);
    try {
      const response = await readerService.lookupReaderByPhone(phone);
      if (response.code === ErrorCode.SUCCESS && response.data) {
        const reader = response.data as Reader;
        handleSelectReader(reader);
      } else {
        // User not found -> treat as new guest
        setSelectedReader(null);
        form.setValue("userId", "");
        form.setValue("phone", phone);
        setIsNewUser(true);
        toast.info("New reader detected. A guest account will be created.");
      }
    } catch (error) {
      console.error("Lookup failed", error);
    } finally {
      setIsLookupLoading(false);
    }
  };

  const handleSelectReader = (reader: Reader) => {
    if (!validateBorrow(reader, [])) {
      return;
    }
    setSelectedReader(reader);
    form.setValue("userId", reader.id);
    form.setValue("phone", reader.phoneRaw || "");
    setPhoneSearch("");
    setIsNewUser(false);
  };

  const handleAddToCart = (book: BookEntity) => {
    if (!selectedReader && !isNewUser) return;

    if (!validateBorrow(selectedReader, cart, book)) {
      return;
    }

    const newCart = [...cart, book];
    setCart(newCart);
    form.setValue("bookIds", newCart.map(b => b.id));
    setBookSearch("");
  };

  const handleRemoveFromCart = (bookId: string) => {
    const newCart = cart.filter(b => b.id !== bookId);
    setCart(newCart);
    form.setValue("bookIds", newCart.map(b => b.id));
  };

  const onSubmit = async (values: BorrowFormValues) => {
    if (!selectedReader && !isNewUser) return;

    // Final client-side validation
    if (!validateBorrow(selectedReader, cart)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await borrowService.createBorrow({
        ...values,
        reservationId: initialReservation?.id
      } as any);
      if (response.code === ErrorCode.SUCCESS) {
        toast.success("Borrow record created successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(getErrorMessage(response.code));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create borrow record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            New Borrow Transaction
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Selection */}
              <div className="space-y-6">
                {/* Reader Selection */}
                <div className="space-y-3">
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" /> 1. Identify Reader
                  </FormLabel>

                  {!selectedReader && !isNewUser ? (
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter phone number..."
                          className="pl-9"
                          value={phoneSearch}
                          onChange={(e) => setPhoneSearch(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handlePhoneLookup(phoneSearch))}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => handlePhoneLookup(phoneSearch)}
                        disabled={isLookupLoading || phoneSearch.length < 9}
                      >
                        {isLookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lookup"}
                      </Button>
                    </div>
                  ) : selectedReader ? (
                    <Card className="p-3 bg-primary/5 border-primary/20 flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {selectedReader.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{selectedReader.name}</span>
                          <span className="text-xs text-muted-foreground">{selectedReader.phoneRaw || selectedReader.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Status</span>
                          <div className="flex items-center gap-1">
                            {selectedReader.hasOverdueBooks && (
                              <Badge variant="destructive" className="text-[8px] h-4">Overdue</Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] h-4">
                              {selectedReader.currentBorrowCount}/{selectedReader.borrowLimit}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedReader(null); setPhoneSearch(""); setIsNewUser(false); }} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-3 bg-amber-50 border-amber-200 flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-amber-900">New Guest Reader</span>
                          <span className="text-xs text-amber-700">{form.getValues("phone")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">New Account</Badge>
                        <Button variant="ghost" size="icon" onClick={() => { setIsNewUser(false); setPhoneSearch(""); }} className="h-8 w-8 text-amber-700 hover:text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )}
                  <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                </div>

                {/* Book Selection */}
                <div className="space-y-3">
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <Plus className="h-4 w-4" /> 2. Add Books
                  </FormLabel>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search book title or call number..."
                      className="pl-9"
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      disabled={!selectedReader && !isNewUser}
                    />
                    {filteredBooks.length > 0 && (
                      <Card className="absolute z-50 w-full mt-1 shadow-xl border-primary/20 overflow-hidden">
                        {filteredBooks.map(b => (
                          <div
                            key={b.id}
                            className="p-3 hover:bg-accent cursor-pointer flex justify-between items-center transition-colors border-b last:border-0"
                            onClick={() => handleAddToCart(b)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{b.title}</span>
                              <span className="text-xs text-muted-foreground">{b.callNumber}</span>
                            </div>
                            <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              Available: {b.availableQuantity}
                            </div>
                          </div>
                        ))}
                      </Card>
                    )}
                  </div>
                  {!selectedReader && !isNewUser && <p className="text-[10px] text-muted-foreground italic">Please identify a reader first</p>}
                </div>

                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> 3. Due Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={format(field.value, "yyyy-MM-dd")}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column: Cart & Summary */}
              <div className="bg-accent/30 rounded-xl p-5 flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Borrow Cart</h3>
                  <Badge variant="secondary">{cart.length} items</Badge>
                </div>

                <ScrollArea className="flex-grow pr-3">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 opacity-40">
                      <div className="h-12 w-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                        <Plus className="h-6 w-6" />
                      </div>
                      <p className="text-xs">No books added yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(book => (
                        <Card key={book.id} className="p-3 bg-background border-none shadow-sm group">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-bold line-clamp-1">{book.title}</span>
                              <span className="text-[10px] font-mono text-muted-foreground">{book.callNumber}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFromCart(book.id)}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="mt-4 pt-4 border-t border-accent-foreground/10 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Borrow Date:</span>
                    <span className="font-medium">{format(new Date(), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-bold text-primary">{format(form.watch("dueDate"), "dd MMM yyyy")}</span>
                  </div>
                  <Separator className="my-2 bg-accent-foreground/5" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold">Total Books:</span>
                    <span className="text-xl font-black text-primary">{cart.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 bg-accent/20 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || cart.length === 0 || (!selectedReader && !isNewUser)}
                className="px-8 font-bold"
              >
                {isSubmitting ? "Processing..." : "Confirm Borrow"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

