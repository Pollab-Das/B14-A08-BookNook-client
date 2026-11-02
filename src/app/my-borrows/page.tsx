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
  const [borrows, setBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBorrows = () => {
    if (session?.user?.email) {
      fetchWithAuth(`/borrows?email=${session.user.email}`)
        .then((data) => {
          setBorrows(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => { loadBorrows(); }, [session]);

  const handleReturn = async (id: string) => {
    try {
      await fetchWithAuth(`/borrows/${id}`, { method: "DELETE" });
      toast.success("Book returned successfully!");
      loadBorrows(); // রিফ্রেশ লিস্ট
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isPending || loading) return null;
  if (!session) return <div className="text-center py-20">Please login.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-forest mb-8">My Borrows</h1>
      
      {borrows.length === 0 ? (
        <p className="text-text-muted">You haven't borrowed any books yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-light bg-white">
          <table className="w-full text-left text-sm text-text-main">
            <thead className="bg-cream text-forest font-semibold border-b border-border-light">
              <tr>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4">Borrow Date</th>
                <th className="px-6 py-4">Return Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow._id} className="border-b border-border-light last:border-0">
                  <td className="px-6 py-4 flex items-center gap-4">
                     <div className="relative h-12 w-10 overflow-hidden rounded">
                      <Image src={borrow.bookImage} alt={borrow.bookTitle} fill className="object-cover" />
                    </div>
                    <span className="font-semibold text-forest">{borrow.bookTitle}</span>
                  </td>
                  <td className="px-6 py-4">{format(new Date(borrow.borrowDate), "MMM dd, yyyy")}</td>
                  <td className="px-6 py-4 text-terracotta font-medium">{format(new Date(borrow.returnDate), "MMM dd, yyyy")}</td>
                  <td className="px-6 py-4 text-right">
                    <Button onClick={() => handleReturn(borrow._id)} className="bg-forest hover:bg-forest-light dark:bg-terracotta dark:hover:bg-[#a37f6c] text-white font-medium">
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