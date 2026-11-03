"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MyBorrowsPage() {
  const { data: session, isPending } = useSession();
  const { fetchWithAuth } = useApi();
  const [borrows, setBorrows] = useState<any[] | null>(null); // 👈 null 

  const loadBorrows = () => {
    if (session?.user?.email) {
      fetchWithAuth(`/borrows?email=${session.user.email}`)
        .then((data) => {
          setBorrows(data);
        })
        .catch(() => setBorrows([]));
    }
  };

  useEffect(() => { loadBorrows(); }, [session]);

    useEffect(() => {
    document.title = "BookNook | My Borrows";
  }, []);

  const handleReturn = async (id: string) => {
    try {
      await fetchWithAuth(`/borrows/${id}`, { method: "DELETE" });
      toast.success("Book returned successfully!");
      loadBorrows();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // 👇 My Borrows 
  if (isPending || borrows === null) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
        <div className="rounded-xl border border-border-light dark:border-gray-800 bg-white dark:bg-[#1e1e1e] p-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              </div>
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session) return <div className="text-center py-20">Please login.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-forest dark:text-cream mb-8">My Borrows</h1>
      
      {borrows.length === 0 ? (
        <p className="text-text-muted dark:text-gray-400">You haven't borrowed any books yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-light dark:border-gray-800 bg-white dark:bg-[#1e1e1e]">
          <table className="w-full text-left text-sm text-text-main dark:text-gray-300">
            <thead className="bg-cream dark:bg-gray-800 text-forest dark:text-cream font-semibold border-b border-border-light dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4">Borrow Date</th>
                <th className="px-6 py-4">Return Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow._id} className="border-b border-border-light dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                     <div className="relative h-12 w-10 overflow-hidden rounded">
                      <Image src={borrow.bookImage} alt={borrow.bookTitle} fill className="object-cover" />
                    </div>
                    <span className="font-semibold text-forest dark:text-cream">{borrow.bookTitle}</span>
                  </td>
                  <td className="px-6 py-4">{format(new Date(borrow.borrowDate), "MMM dd, yyyy")}</td>
                  <td className="px-6 py-4 text-terracotta font-medium">{format(new Date(borrow.returnDate), "MMM dd, yyyy")}</td>
                  <td className="px-6 py-4 text-right">
                    {/* 👇 Return buttom text-white  */}
                    <Button 
                      onClick={() => handleReturn(borrow._id)} 
                      className="bg-forest hover:bg-forest-light dark:bg-terracotta dark:hover:bg-[#a37f6c] text-white font-medium"
                    >
                      Return Book
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}