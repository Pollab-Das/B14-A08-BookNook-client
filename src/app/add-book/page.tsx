"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { fetchWithAuth } = useApi();
  const [loading, setLoading] = useState(false);

  // 👇 লগইন চেক এবং রিডাইরেক্ট লজিক
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to add a book.");
      router.push(`/login?redirect=/add-book`);
    }
  }, [session, isPending, router]);

  // লোডিং বা সেশন না থাকলে কিছুই রেন্ডার হবে না (পেজ ফ্ল্যাশ এড়াতে)
  if (isPending || !session) {
    return <div className="text-center py-20 text-text-muted">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    data.totalCopies = Number(data.totalCopies);

    try {
      await fetchWithAuth("/books", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userEmail: session.user.email,
          userName: session.user.name,
        }),
      });

      toast.success("Book added successfully!");
      router.push("/books");
    } catch (error: any) {
      console.error("Error adding book:", error);
      toast.error(error.message || "Failed to connect to the server. Make sure it's running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="p-8 bg-white dark:bg-[#1e1e1e] border-border-light dark:border-gray-800 shadow-lg">
        <h1 className="font-serif text-3xl font-bold text-forest dark:text-cream mb-6">Add a New Book</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-main dark:text-gray-300">Book Title</label>
            <Input name="title" required placeholder="The Great Gatsby" className="mt-1 dark:bg-gray-900 dark:border-gray-700" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-main dark:text-gray-300">Author Name</label>
            <Input name="author" required placeholder="F. Scott Fitzgerald" className="mt-1 dark:bg-gray-900 dark:border-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-main dark:text-gray-300">Category</label>
              <select name="category" className="mt-1 flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-900 dark:border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest">
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-main dark:text-gray-300">Total Copies</label>
              <Input name="totalCopies" type="number" min="1" defaultValue="1" required className="mt-1 dark:bg-gray-900 dark:border-gray-700" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-main dark:text-gray-300">Image URL</label>
            <Input name="image" type="url" required placeholder="https://images.unsplash.com/..." className="mt-1 dark:bg-gray-900 dark:border-gray-700" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-main dark:text-gray-300">Short Description</label>
            <textarea name="description" required className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-background dark:bg-gray-900 dark:border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest" placeholder="Describe the book..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium text-text-main dark:text-gray-300">Your Name (Read Only)</label>
               <Input value={session.user.name} disabled className="mt-1 bg-gray-100 dark:bg-gray-800" />
             </div>
             <div>
               <label className="text-sm font-medium text-text-main dark:text-gray-300">Your Email (Read Only)</label>
               <Input value={session.user.email} disabled className="mt-1 bg-gray-100 dark:bg-gray-800" />
             </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-forest hover:bg-forest-light text-white dark:bg-terracotta dark:hover:bg-[#a37f6c] h-11 text-base mt-4">
            {loading ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </Card>
    </div>
  );
}