"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    title: "Unlock New Worlds",
    desc: "Explore thousands of books spanning across Fiction, Science, and History.",
    bg: "bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')]",
  },
  {
    title: "Share Your Library",
    desc: "Add your own books to BookNook and let others borrow them.",
    bg: "bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop')]",
  },
  {
    title: "Read, Return, Repeat",
    desc: "Borrow a book for 7 days. No hidden fees, just pure reading.",
    bg: "bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop')]",
  },
];

export function HeroSlider() {
  return (
    <div className="h-[500px] w-full relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={`relative flex h-full w-full items-center justify-center ${slide.bg} bg-cover bg-center`}>
              <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
              <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
                <h1 className="font-serif text-4xl font-bold text-cream sm:text-5xl md:text-6xl mb-6">
                  {slide.title}
                </h1>
                <p className="text-lg text-cream/90 mb-8 sm:text-xl">
                  {slide.desc}
                </p>
                <Link href="/books">
                  <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full px-8">
                    Browse Books
                  </Button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}