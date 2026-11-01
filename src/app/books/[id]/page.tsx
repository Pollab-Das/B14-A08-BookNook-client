"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { fetchWithAuth } = useApi();
  
  const [book, setBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`)
      .then((res) => res.json())
      .then(setBook)
      .catch(() => toast.error("Book not found"));
  }, [id]);

  const handleBorrow = async () => {
    if (!session) {
      toast.error("Please login to borrow a book.");
      router.push(`/login?redirect=/books/${id}`);
      return;
    }

    setBorrowing(true);
    try {
      await fetchWithAuth("/borrows", {
        method: "POST",
        body: JSON.stringify({ bookId: id, userEmail: session.user.email }),
      });
      toast.success("Book borrowed successfully! Check My Borrows.");
      setIsModalOpen(false);
      // অপশনাল: লাইভ কপি নাম্বার আপডেট করতে চাইলে book.availableCopies -= 1 করে setBook({...book}) করতে পারেন
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBorrowing(false);
    }
  };

  if (!book) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Image Area */}
        <div className="w-full md:w-1/3">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-lg border border-border-light">
            <Image src={book.image} alt={book.title} fill className="object-cover" />
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-1">
          <span className="inline-block rounded-full bg-terracotta/20 px-3 py-1 text-xs font-semibold text-terracotta uppercase">
            {book.category}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-forest">{book.title}</h1>
          <p className="mt-2 text-lg text-text-muted">By <span className="font-semibold text-forest">{book.author}</span></p>
          
          <div className="mt-6 border-y border-border-light py-4">
             <p className="text-sm"><strong>Added by:</strong> {book.userName} ({book.userEmail})</p>
             <p className="text-sm mt-1"><strong>Available Copies:</strong> {book.availableCopies} / {book.totalCopies}</p>
          </div>

          <div className="mt-6">
            <h2 className="font-serif text-xl font-bold text-forest mb-2">Description</h2>
            <p className="text-text-main leading-relaxed">{book.description}</p>
          </div>

          <div className="mt-10">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger 
                render={
                  <Button 
                    disabled={book.availableCopies <= 0} 
                    className="w-full md:w-auto px-10 bg-forest hover:bg-forest-light h-12 text-lg"
                  >
                    {book.availableCopies > 0 ? "Borrow This Book" : "Not Available"}
                  </Button>
                } 
              />
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-forest">Confirm Borrow</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-3">
                  <p className="text-sm"><strong>User:</strong> {session?.user?.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {session?.user?.email}</p>
                  <p className="text-sm"><strong>Return Date:</strong> 7 days from today</p>
                </div>
                <Button onClick={handleBorrow} disabled={borrowing} className="w-full bg-forest">
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