"use client";

import { useState } from "react";
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

  if (isPending) {
    return <div className="text-center py-20 text-text-muted">Loading...</div>;
  }

  if (!session) {
    router.push("/login?redirect=/add-book");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // totalCopies কে নাম্বারে কনভার্ট করা হচ্ছে
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
      // সার্ভার ডাউন থাকলে বা JSON ফরম্যাট ভুল হলে এই মেসেজ দেখাবে
      toast.error(error.message || "Failed to connect to the server. Make sure it's running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="p-8 bg-white border-border-light">
        <h1 className="font-serif text-3xl font-bold text-forest mb-6">Add a New Book</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Book Title</label>
            <Input name="title" required placeholder="The Great Gatsby" />
          </div>
          <div>
            <label className="text-sm font-medium">Author Name</label>
            <Input name="author" required placeholder="F. Scott Fitzgerald" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Total Copies</label>
              <Input name="totalCopies" type="number" min="1" defaultValue="1" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input name="image" type="url" required placeholder="https://images.unsplash.com/..." />
          </div>
          <div>
            <label className="text-sm font-medium">Short Description</label>
            <textarea name="description" required className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Describe the book..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium">Your Name (Read Only)</label>
               <Input value={session.user.name} disabled />
             </div>
             <div>
               <label className="text-sm font-medium">Your Email (Read Only)</label>
               <Input value={session.user.email} disabled />
             </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-forest hover:bg-forest-light h-11 text-base">
            {loading ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </Card>
    </div>
  );
}