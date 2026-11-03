import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import BookDetailsClient from "./BookDetailsClient";

// books/[id]
export const metadata = {
  title: "BookNook | Book Details",
};

export default async function BookDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // BetterAuth 
  const session = await auth.api.getSession({ headers: await headers() });
  
  // login 
  if (!session) {
    redirect(`/login?redirect=/books/${id}`);
  }

  // 👇 fetch data 
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, { 
    cache: "no-store" 
  });
  
  if (!res.ok) {
    notFound(); // 404 
  }
  
  const book = await res.json();

  // client 
  return <BookDetailsClient book={book} session={session} />;
}