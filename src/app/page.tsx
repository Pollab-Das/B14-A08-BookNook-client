import Link from "next/link";
import { ArrowRight, BookMarked, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/home/HeroSlider";
import { NewArrivals } from "@/components/home/NewArrivals";
import { TrendingBooks } from "@/components/home/TrendingBooks"; // 👈 নতুন কম্পোনেন্ট

export default function Home() {
  return (
    <div className="flex flex-col pb-16">
      
      {/* 1. Banner Slider */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* 2. New Arrivals (Dynamic) */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <NewArrivals /> 
      </section>

      {/* 👇 3. Trending Now (নতুন সেকশন) */}
      <section className="w-full">
        <TrendingBooks />
      </section>

      {/* 4. Extra Static Section: How Borrowing Works */}
      <section className="bg-forest py-16 text-cream mt-16">
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
              <div key={i} className="rounded-xl border border-cream/20 bg-forest-light/30 p-6">
                <step.icon className="h-8 w-8 text-terracotta mb-4" />
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-cream/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Extra Static Section: Explore Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-forest dark:text-cream">Explore Categories</h2>
          <p className="mt-2 text-text-muted dark:text-gray-400">Find exactly what you're looking for.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
           {["Fiction", "Science", "History", "Kids", "Others"].map((cat) => (
             <Link 
               key={cat} 
               href={`/books`} 
               className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-border-light dark:border-gray-800 bg-white dark:bg-[#1e1e1e] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-ocean dark:hover:border-terracotta"
             >
                <span className="text-lg font-medium text-forest dark:text-cream">{cat}</span>
             </Link>
           ))}
        </div>
      </section>

    </div>
  );
}