import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import BookDetailsClient from "./BookDetailsClient";

export default async function BookDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 👇 ১. সার্ভার সাইডে BetterAuth সেশন চেক
  const session = await auth.api.getSession({ headers: await headers() });
  
  // লগইন না থাকলে সরাসরি লগইন পেজে পাঠাবে এবং লগইনের পর আবার এই বুকেই ফেরত আনবে
  if (!session) {
    redirect(`/login?redirect=/books/${id}`);
  }

  // 👇 ২. সার্ভার থেকে বইয়ের ডেটা ফেচ করা
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, { 
    cache: "no-store" 
  });
  
  if (!res.ok) {
    notFound(); // বই না পাওয়া গেলে 404 পেজ দেখাবে
  }
  
  const book = await res.json();

  // 👇 ৩. ক্লায়েন্ট কম্পোনেন্টে ডেটা এবং সেশন পাস করা
  return <BookDetailsClient book={book} session={session} />;
}