"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function BookDetailsClient({ book, session }: { book: any, session: any }) {
  const router = useRouter();
  const { fetchWithAuth } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = async () => {
    setBorrowing(true);
    try {
      await fetchWithAuth("/borrows", {
        method: "POST",
        body: JSON.stringify({ bookId: book._id, userEmail: session.user.email }),
      });
      toast.success("Book borrowed successfully! Check My Borrows.");
      setIsModalOpen(false);
      router.push("/my-borrows");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Image Area */}
        <div className="w-full md:w-1/3">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-lg border border-border-light dark:border-gray-800">
            <Image src={book.image} alt={book.title} fill className="object-cover" />
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-1">
          <span className="inline-block rounded-md bg-terracotta/20 px-3 py-1 text-xs font-bold text-terracotta uppercase tracking-wider">
            {book.category}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-forest dark:text-cream">{book.title}</h1>
          <p className="mt-2 text-lg text-text-muted dark:text-gray-400">By <span className="font-semibold text-forest dark:text-cream">{book.author}</span></p>
          
          <div className="mt-6 border-y border-border-light dark:border-gray-800 py-4 flex flex-wrap gap-x-8 gap-y-2">
             <p className="text-sm text-text-main dark:text-gray-300"><strong>Added by:</strong> {book.userName}</p>
             <p className="text-sm text-text-main dark:text-gray-300"><strong>Available:</strong> {book.availableCopies} / {book.totalCopies} Copies</p>
          </div>

          <div className="mt-6">
            <h2 className="font-serif text-xl font-bold text-forest dark:text-cream mb-2">Description</h2>
            <p className="text-text-main dark:text-gray-400 leading-relaxed">{book.description}</p>
          </div>

          <div className="mt-10">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger 
                render={
                  <Button 
                    disabled={book.availableCopies <= 0} 
                    className="w-full md:w-auto px-10 bg-forest hover:bg-forest-light dark:bg-terracotta dark:hover:bg-[#a37f6c] text-white h-12 text-lg"
                  >
                    {book.availableCopies > 0 ? "Borrow This Book" : "Not Available"}
                  </Button>
                } 
              />
              <DialogContent className="bg-white dark:bg-[#1e1e1e]">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-forest dark:text-cream">Confirm Borrow</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-3">
                  <p className="text-sm dark:text-gray-300"><strong>User:</strong> {session?.user?.name}</p>
                  <p className="text-sm dark:text-gray-300"><strong>Email:</strong> {session?.user?.email}</p>
                  <p className="text-sm dark:text-gray-300"><strong>Return Date:</strong> 7 days from today</p>
                </div>
                <Button onClick={handleBorrow} disabled={borrowing} className="w-full bg-forest dark:bg-terracotta text-white">
                  {borrowing ? "Processing..." : "Confirm Borrow"}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}