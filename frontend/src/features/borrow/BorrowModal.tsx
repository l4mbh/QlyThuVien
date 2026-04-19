import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const BorrowModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");

  const handleBorrow = () => {
    // Basic implementation for now
    console.log("Borrowing book", selectedBook, "for user", selectedUser);
    setOpen(false);
    setSelectedUser("");
    setSelectedBook("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Borrow Record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Borrow Record</DialogTitle>
          <DialogDescription>
            Enter the details of the user and the book they wish to borrow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="user" className="text-sm font-medium">
              User ID / Name
            </label>
            <Input
              id="user"
              value={selectedUser}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedUser(e.target.value)}
              placeholder="e.g. USER-1234"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="book" className="text-sm font-medium">
              Book ID / Title
            </label>
            <Input
              id="book"
              value={selectedBook}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedBook(e.target.value)}
              placeholder="e.g. BOOK-5678"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleBorrow} disabled={!selectedUser || !selectedBook}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
