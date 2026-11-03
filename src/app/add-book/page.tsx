"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react"; // ইমেজ আপলোডের আইকন

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { fetchWithAuth } = useApi();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // ইমেজ URL স্টেট
  const [uploading, setUploading] = useState(false); // আপলোড লোডিং স্টেট

  // সেশন চেক
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to add a book.");
      router.push(`/login?redirect=/add-book`);
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return <div className="text-center py-20 text-text-muted">Loading...</div>;
  }

  // 👇 ImgBB-তে ইমেজ আপলোড করার ফাংশন
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed. Try again.");
      }
    } catch (error) {
      toast.error("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Please upload an image first.");
      return;
    }
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    
    // totalCopies কে নাম্বারে কনভার্ট করা
    data.totalCopies = Number(data.totalCopies);
    // imageUrl ফিল্ডে আমাদের আপলোড করা লিংকটা সেট করা
    data.image = imageUrl;

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
      toast.error(error.message || "Failed to connect to the server.");
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
              <select name="category" className="mt-1 flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-900 dark:border-gray-700 px-3 py-2 text-sm">
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

          {/* 👇 ইমেজ আপলোড সেকশন */}
          <div className="border-2 border-dashed border-border-light dark:border-gray-700 rounded-lg p-4 text-center">
            <label className="text-sm font-medium text-text-main dark:text-gray-300">Book Image</label>
            <div className="mt-2 flex flex-col items-center gap-3">
              {imageUrl ? (
                <div className="relative w-full h-40">
                  <img src={imageUrl} alt="Uploaded" className="w-full h-full object-contain rounded-md" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-text-muted" />
                  <p className="text-sm text-text-muted">Select an image from your device</p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploading}
                    className="max-w-xs"
                  />
                  {uploading && <p className="text-sm text-forest animate-pulse">Uploading...</p>}
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text-main dark:text-gray-300">Short Description</label>
            <textarea name="description" required className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-background dark:bg-gray-900 dark:border-gray-700 px-3 py-2 text-sm" placeholder="Describe the book..." />
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
          
          <Button type="submit" disabled={loading || uploading || !imageUrl} className="w-full bg-forest hover:bg-forest-light text-white dark:bg-terracotta dark:hover:bg-[#a37f6c] h-11 text-base mt-4">
            {loading ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </Card>
    </div>
  );
}