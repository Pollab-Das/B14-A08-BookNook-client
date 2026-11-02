"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["All Genres", "Fiction", "Science", "History", "Kids", "Others"];

export function NewArrivals() {
  const [books, setBooks] = useState<any[] | null>(null);
  const [activeCategory, setActiveCategory] = useState("All Genres");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setBooks(data.slice(0, 6))) // লেটেস্ট ৬টি বই নেওয়া হলো
      .catch(() => setBooks([]));
  }, []);

  // ক্যাটাগরি অনুযায়ী ফিল্টার
  const filteredBooks = books?.filter((book) => 
    activeCategory === "All Genres" ? true : book.category === activeCategory
  );

  if (books === null) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[400px] animate-pulse rounded-xl bg-border-light/50" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* হেডিং এবং ফিল্টার বাটন */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-forest dark:text-cream">
            New Arrivals
          </h2>
          <p className="mt-2 text-text-muted dark:text-gray-400">
            Discover the latest additions to our library.
          </p>
        </div>

        {/* ডানদিকের ক্যাটাগরি ফিল্টার */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-forest text-white dark:bg-terracotta dark:text-white"
                  : "bg-white text-text-muted border border-border-light hover:border-forest dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-terracotta"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* বইয়ের গ্রিড */}
      {filteredBooks && filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <div 
              key={book._id} 
              className="group flex flex-col overflow-hidden rounded-xl border border-border-light bg-white shadow-sm transition-all hover:shadow-md dark:bg-[#1e1e1e] dark:border-gray-800"
            >
              {/* ইমেজ এবং ক্যাটাগরি ব্যাজ */}
              <div className="relative h-64 w-full bg-cream-dark dark:bg-gray-900 overflow-hidden">
                <Image 
                  src={book.image} 
                  alt={book.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                
                {/* 👇 কার্ডের ওপরে সুন্দর ক্যাটাগরি ব্যাজ */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-block rounded-md bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {book.category}
                  </span>
                </div>
                
                {/* কপি ইনফো */}
                <div className="absolute bottom-3 right-3 z-10">
                  <span className="inline-block rounded-md bg-black/60 backdrop-blur-md px-2 py-1 text-xs font-medium text-white">
                    {book.availableCopies} Copies Left
                  </span>
                </div>
              </div>

              {/* কার্ডের টেক্সট */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mt-1 font-serif text-xl font-bold text-forest dark:text-cream line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                  by {book.author}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-3 line-clamp-2">
                  {book.description}
                </p>
                
                <div className="mt-auto pt-5">
                  <Link href={`/books/${book._id}`}>
                    <Button className="w-full bg-forest hover:bg-forest-light dark:bg-terracotta dark:hover:bg-[#a37f6c] text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted">
          No books found in this category.
        </div>
      )}

      {/* নিচে See All Books বাটন */}
      <div className="mt-12 flex justify-center">
        <Link href="/books">
          <Button variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white dark:border-terracotta dark:text-terracotta dark:hover:bg-terracotta dark:hover:text-white gap-2 px-8 py-6 text-base rounded-full transition-all">
            See All Books <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </>
  );
}