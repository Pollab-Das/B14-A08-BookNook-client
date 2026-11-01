"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AllBooksPage() {
  const [books, setBooks] = useState<any[] | null>(null); // 👈 এখানে null দিন

  useEffect(() => {
    // 👈 ব্রাউজার ফেচে ক্যাশ আটকাতে headers বা cache ব্যবহার করা যায়
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
      cache: "no-store",
      headers: { "Pragma": "no-cache" }
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((err) => {
        console.error(err);
        setBooks([]); // এরর হলে ফাঁকা অ্যারে
      });
  }, []);

  if (books === null) {
    return <div className="text-center py-20 text-text-muted">Loading books...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-forest">All Books</h1>
        <p className="mt-2 text-text-muted">Explore our entire collection.</p>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          No books available yet. <br />
          <Link href="/add-book" className="text-forest underline mt-2 inline-block">Add the first book!</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div key={book._id} className="group flex flex-col overflow-hidden rounded-xl border border-border-light bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative h-64 w-full bg-cream-dark">
                <Image src={book.image} alt={book.title} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">{book.category}</span>
                <h3 className="mt-1 font-serif text-lg font-bold text-forest line-clamp-1">{book.title}</h3>
                <p className="text-sm text-text-muted">by {book.author}</p>
                <div className="mt-auto pt-4">
                  <Link href={`/books/${book._id}`}>
                    <Button className="w-full bg-forest hover:bg-forest-light">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}