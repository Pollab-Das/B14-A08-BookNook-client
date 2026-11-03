import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookMarked, Clock, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/home/HeroSlider";
import { NewArrivals } from "@/components/home/NewArrivals";

// সার্ভার সাইডে ডেটা ফেচ করার ফাংশন
async function getBooks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const books = await getBooks();
  // ফিচার্ড বই হিসেবে ৪ নাম্বার ইনডেক্সের বইটি সিলেক্ট করা হলো (যদি থাকে)
  const bookOfTheMonth = books.length > 3 ? books[3] : books[0];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* 1. Banner Slider */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* 2. New Arrivals (Dynamic) */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <NewArrivals /> 
      </section>

      {/* 👇 3. Book of the Month Section (নতুন যোগ করা) */}
      {bookOfTheMonth && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border-light bg-white shadow-xl dark:bg-[#1e1e1e] dark:border-gray-800 transition-colors duration-300">
            <div className="grid md:grid-cols-2">
              
              {/* বাম দিক: বড় ইমেজ */}
              <div className="relative h-[400px] md:h-auto w-full bg-cream-dark dark:bg-gray-900">
                <Image 
                  src={bookOfTheMonth.image} 
                  alt={bookOfTheMonth.title} 
                  fill 
                  className="object-cover" 
                />
                {/* ইমেজের ওপর একটি ব্যাজ */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-bold text-white shadow-lg">
                    <Star className="h-4 w-4 fill-white" /> Book of the Month
                  </span>
                </div>
              </div>

              {/* ডান দিক: টেক্সট এবং বাটন */}
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <span className="text-sm font-bold tracking-widest text-terracotta uppercase mb-2">
                  {bookOfTheMonth.category}
                </span>
                
                <h2 className="font-serif text-3xl font-bold text-forest dark:text-cream sm:text-4xl md:text-5xl leading-tight">
                  {bookOfTheMonth.title}
                </h2>
                
                <p className="mt-3 text-lg text-text-muted dark:text-gray-400">
                  By <span className="font-semibold text-forest dark:text-cream">{bookOfTheMonth.author}</span>
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex text-[#E29A22]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-text-muted dark:text-gray-400">
                    (4.9 / 5.0) · 1.2k Reviews
                  </span>
                </div>

                <p className="mt-6 text-base text-text-main dark:text-gray-300 leading-relaxed line-clamp-4">
                  {bookOfTheMonth.description}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                  <Link href={`/books/${bookOfTheMonth._id}`} className="w-full sm:w-auto">
                    <Button className="w-full bg-forest hover:bg-forest-light dark:bg-terracotta dark:hover:bg-[#a37f6c] text-white px-8 py-6 text-lg rounded-xl">
                      Read This Book
                    </Button>
                  </Link>
                  <Link href="/books" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-forest text-forest dark:border-cream dark:text-cream hover:bg-forest hover:text-white dark:hover:bg-terracotta dark:hover:text-white px-8 py-6 text-lg rounded-xl gap-2 transition-colors">
                      Browse All <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 4. Extra Static Section 1: How Borrowing Works */}
      <section className="bg-forest py-16 text-cream dark:bg-[#1a1a1a] dark:border-y dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold">How Borrowing Works</h2>
          <p className="mt-4 text-cream/80 max-w-2xl mx-auto">
            Getting lost in a good book has never been easier. Follow these simple steps.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3 text-left">
            {[
              { icon: BookMarked, title: "1. Find a Book", desc: "Browse our collection and find the perfect read." },
              { icon: Clock, title: "2. Borrow Instantly", desc: "Click borrow and get 7 days to read it." },
              { icon: ShieldCheck, title: "3. Return Safely", desc: "Return it from your dashboard when done." },
            ].map((step, i) => (
              <div key={i} className="rounded-xl border border-cream/20 bg-forest-light/30 p-6 dark:bg-gray-800/50 dark:border-gray-700">
                <step.icon className="h-8 w-8 text-terracotta mb-4" />
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-cream/70 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Extra Static Section 2: Top Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-forest dark:text-cream">Explore Categories</h2>
          <p className="mt-2 text-text-muted dark:text-gray-400">Find exactly what you're looking for.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
           {["Fiction", "Science", "History", "Kids", "Others"].map((cat) => (
             <Link href={`/books?category=${cat}`} key={cat} className="flex flex-col items-center justify-center rounded-xl border border-border-light bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-ocean dark:bg-[#1e1e1e] dark:border-gray-800 dark:hover:border-terracotta">
                <span className="text-lg font-medium text-forest dark:text-cream">{cat}</span>
             </Link>
           ))}
        </div>
      </section>
    </div>
  );
}