"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewArrivals() {
  const [books, setBooks] = useState<any[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setBooks(data.slice(0, 6)))
      .catch(() => setBooks([]));
  }, []);

  if (books === null) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[380px] animate-pulse rounded-xl bg-border-light/50" />
        ))}
      </div>
    );
  }

  if (books.length === 0) return null;

  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-forest">New Arrivals</h2>
          <p className="mt-2 text-text-muted">Discover the latest additions to our library.</p>
        </div>
        <Link href="/books">
          <Button variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white gap-2">
            See All Books <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

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
    </>
  );
}