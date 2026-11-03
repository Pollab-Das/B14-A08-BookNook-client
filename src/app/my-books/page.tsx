"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const { fetchWithAuth } = useApi();
  const [books, setBooks] = useState<any[] | null>(null); // 👈 null 

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
        .then((res) => res.json())
        .then((data) => setBooks(data.filter((b: any) => b.userEmail === session.user.email)))
        .catch(() => setBooks([]));
    }
  }, [session]);

    useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await fetchWithAuth(`/books/${id}`, { method: "DELETE" });
      setBooks(books?.filter((b) => b._id !== id) || []);
      toast.success("Book deleted.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // 👇 My Books 
  if (isPending || books === null) {
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
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session) return <div className="text-center py-20">Please login.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-forest dark:text-cream mb-8">My Books</h1>
      
      {books.length === 0 ? (
        <p className="text-text-muted dark:text-gray-400">You haven't added any books yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-light dark:border-gray-800 bg-white dark:bg-[#1e1e1e]">
          <table className="w-full text-left text-sm text-text-main dark:text-gray-300">
            <thead className="bg-cream dark:bg-gray-800 text-forest dark:text-cream font-semibold border-b border-border-light dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4">Copies</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b border-border-light dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="relative h-12 w-10 overflow-hidden rounded">
                      <Image src={book.image} alt={book.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-forest dark:text-cream">{book.title}</p>
                      <p className="text-xs text-text-muted dark:text-gray-400">{book.author}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{book.availableCopies} / {book.totalCopies}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="outline" size="sm" className="text-ocean border-ocean hover:bg-ocean/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(book._id)} className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
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