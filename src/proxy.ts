import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

// 👇 ফাংশনের নাম অবশ্যই 'proxy' হতে হবে
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user;

  if (!user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-book", "/my-books", "/my-borrows"],
};