import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function middleware(request: NextRequest) {
  // BetterAuth 
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const user = session?.user

  // LOGIN 
  if (!user) {
    const url = new URL('/login', request.url)
    
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// BookNook private route

export const config = {
  matcher: [
    '/add-book', 
    '/my-books', 
    '/my-borrows'
  ],
}