"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrendingBooks() {
  const [trendingBooks, setTrendingBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        // ডেটা থেকে র‍্যান্ডম ৩টি বই বেছে নেওয়া
        const shuffled = data.sort(() => 0.5 - Math.random());
        setTrendingBooks(shuffled.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-border-light animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-border-light/50 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (trendingBooks.length === 0) return null;

  return (
    <section className="w-full bg-[#121212] py-20 relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (গ্লো ইফেক্ট) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="flex items-center gap-2 text-terracotta font-semibold tracking-widest uppercase text-sm mb-2">
              <Flame className="h-4 w-4" /> Trending Now
            </span>
            <h2 className="font-serif text-4xl font-bold text-cream">
              Popular This Week
            </h2>
          </div>
          <Link href="/books">
            <Button variant="outline" className="border-gray-600 text-cream hover:bg-terracotta hover:text-white hover:border-terracotta transition-all gap-2">
              Explore All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingBooks.map((book, index) => (
            <div 
              key={book._id} 
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1e1e1e] border border-gray-800 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-terracotta/50"
            >
              {/* র‍্যাংকিং নাম্বার */}
              <div className="absolute top-4 left-4 z-20 flex items-center justify-center h-10 w-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xl font-bold text-white font-serif">
                #{index + 1}
              </div>

              <div className="relative h-72 w-full overflow-hidden">
                <Image 
                  src={book.image} 
                  alt={book.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-transparent opacity-90" />
                
                {/* ব্যাজ */}
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="inline-block rounded-md bg-terracotta px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {book.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-2xl font-bold text-cream line-clamp-1 group-hover:text-terracotta transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">by {book.author}</p>
                
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <Link href={`/books/${book._id}`} className="w-full">
                    <Button className="w-full bg-forest hover:bg-forest-light text-white border-0">
                      Read Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}