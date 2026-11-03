"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const categories = ["All Categories", "Fiction", "Science", "History", "Kids", "Others"];
const availabilityOptions = ["All Books", "Available", "Out of Stock"];

export default function AllBooksPage() {
  const [books, setBooks] = useState<any[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeAvailability, setActiveAvailability] = useState("All Books"); // 👈 নতুন স্টেট

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, { 
      cache: "no-store",
      headers: { "Pragma": "no-cache" }
    })
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => setBooks([]));
  }, []);

  // সার্চ, ক্যাটাগরি, অ্যাভেইলেবিলিটি এবং সর্টিং লজিক একসাথে
  const filteredAndSortedBooks = books
    ?.filter((book) => {
      // ১. ক্যাটাগরি ফিল্টার
      const matchesCategory = activeCategory === "All Categories" || book.category === activeCategory;
      
      // ২. অ্যাভেইলেবিলিটি ফিল্টার (Available নাকি Out of Stock)
      let matchesAvailability = true;
      if (activeAvailability === "Available") {
        matchesAvailability = book.availableCopies > 0;
      } else if (activeAvailability === "Out of Stock") {
        matchesAvailability = book.availableCopies <= 0;
      }

      // ৩. সার্চ ফিল্টার
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        book.title.toLowerCase().includes(searchLower) || 
        book.author.toLowerCase().includes(searchLower) ||
        book.category.toLowerCase().includes(searchLower);
        
      return matchesCategory && matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  if (books === null) {
    return <div className="text-center py-20 text-text-muted">Loading books...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-forest dark:text-cream">All Books</h1>
        <p className="mt-2 text-text-muted dark:text-gray-400">Explore our entire collection.</p>
      </div>

      {/* 👇 সার্চ, সর্ট, ক্যাটাগরি এবং অ্যাভেইলেবিলিটি ফিল্টার বক্স */}
      <div className="mb-10 rounded-xl border border-border-light dark:border-gray-800 bg-white dark:bg-[#1e1e1e] p-5 shadow-sm">
        
        {/* টপ রো: সার্চ এবং সর্ট */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
          <div className="relative w-full md:w-3/5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search by title, author, genre or keyword..." 
              className="pl-10 h-11 bg-gray-50 dark:bg-gray-900 border-border-light dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-sm text-text-muted dark:text-gray-400 whitespace-nowrap">Sort:</span>
            <select 
              className="h-11 w-full md:w-48 rounded-md border border-border-light dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 text-sm focus:outline-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* মিডল রো: অ্যাভেইলেবিলিটি ফিল্টার */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border-light dark:border-gray-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-gray-400 mr-2">
            Availability:
          </span>
          {availabilityOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveAvailability(option)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeAvailability === option
                  ? "bg-ocean text-white dark:bg-ocean" // এভেইলেবিলিটির জন্য নীল/ওশান কালার
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* বটম রো: ক্যাটাগরি ফিল্টার বাটন */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-gray-400 mr-2">
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-[#E29A22] text-white dark:bg-[#E29A22]" 
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* বইয়ের গ্রিড */}
      {filteredAndSortedBooks && filteredAndSortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedBooks.map((book) => (
            <div 
              key={book._id} 
              className="group flex flex-col overflow-hidden rounded-xl border border-border-light bg-white shadow-sm transition-all hover:shadow-md dark:bg-[#1e1e1e] dark:border-gray-800"
            >
              {/* ইমেজ এবং ব্যাজ */}
              <div className="relative h-64 w-full bg-cream-dark dark:bg-gray-900 overflow-hidden">
                <Image 
                  src={book.image} 
                  alt={book.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-block rounded-md bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {book.category}
                  </span>
                </div>
                
                <div className="absolute bottom-3 right-3 z-10">
                  <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium text-white backdrop-blur-md ${book.availableCopies > 0 ? 'bg-black/60' : 'bg-red-600/80'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} Copies Left` : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* টেক্সট */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mt-1 font-serif text-xl font-bold text-forest dark:text-cream line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                  by {book.author}
                </p>
                
                <div className="mt-auto pt-5">
                  <Link href={`/books/${book._id}`}>
                    <Button 
                      className={`w-full font-semibold ${book.availableCopies > 0 ? 'bg-forest hover:bg-forest-light text-white dark:bg-terracotta dark:hover:bg-[#a37f6c]' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                      disabled={book.availableCopies <= 0}
                    >
                      {book.availableCopies > 0 ? "View Details" : "Not Available"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-text-muted">
          No books found matching your search and filters.
        </div>
      )}
    </div>
  );
}