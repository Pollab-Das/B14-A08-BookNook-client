"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const { fetchWithAuth } = useApi();
  const [books, setBooks] = useState<any[]>([]);
  
  
  const [editingBook, setEditingBook] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  
  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  const loadBooks = () => {
    if (session?.user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
        .then((res) => res.json())
        .then((data) => setBooks(data.filter((b: any) => b.userEmail === session.user.email)))
        .catch(console.error);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [session]);

  // AlertDialog 
  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`/books/${id}`, { method: "DELETE" });
      setBooks(books.filter((b) => b._id !== id));
      toast.success("Book deleted successfully.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openEditModal = (book: any) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    data.totalCopies = Number(data.totalCopies);

    try {
      await fetchWithAuth(`/books/${editingBook._id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      toast.success("Book updated successfully!");
      setIsEditModalOpen(false);
      loadBooks();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isPending) return null;
  if (!session) return <div className="text-center py-20 text-text-muted">Please login.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-forest dark:text-cream mb-8">My Books</h1>
      
      {books.length === 0 ? (
        <p className="text-text-muted">You haven't added any books yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-light dark:border-gray-800 bg-white dark:bg-[#1e1e1e]">
          <table className="w-full text-left text-sm text-text-main dark:text-gray-300">
            <thead className="bg-cream dark:bg-gray-900 text-forest dark:text-cream font-semibold border-b border-border-light dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4">Copies</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b border-border-light dark:border-gray-800 last:border-0">
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
                    <Button variant="outline" size="sm" onClick={() => openEditModal(book)} className="text-ocean border-ocean">
                      <Edit className="h-4 w-4" />
                    </Button>

                    {/* AlertDialog  */}
                    <AlertDialog>
                      <AlertDialogTrigger 
                        render={
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AlertDialogContent className="bg-white dark:bg-[#1e1e1e]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif text-2xl text-forest dark:text-cream">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-text-muted dark:text-gray-400">
                            This action cannot be undone. This will permanently delete the book <strong>{book.title}</strong> from the library.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-border-light">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(book._id)} 
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* dialog model */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1e1e1e] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-forest dark:text-cream">Edit Book</DialogTitle>
          </DialogHeader>
          {editingBook && (
            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Book Title</label>
                <Input name="title" defaultValue={editingBook.title} required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Author Name</label>
                <Input name="author" defaultValue={editingBook.author} required className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select name="category" defaultValue={editingBook.category} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-900 px-3 py-2 text-sm">
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Kids">Kids</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Copies</label>
                  <Input name="totalCopies" type="number" min="1" defaultValue={editingBook.totalCopies} required className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input name="image" type="url" defaultValue={editingBook.image} required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" defaultValue={editingBook.description} required className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background dark:bg-gray-900 px-3 py-2 text-sm" />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-forest hover:bg-forest-light text-white dark:bg-terracotta mt-4">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}