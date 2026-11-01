"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { BookOpen, LogOut, User as UserIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-forest" />
          <span className="font-serif text-2xl font-bold tracking-tight text-forest">
            BookNook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-forest ${
                pathname === link.href ? "text-forest" : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {session && privateLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-forest ${
                pathname === link.href ? "text-forest" : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-border-light" />
          ) : session ? (
            <>
              <Link href="/add-book" className="hidden sm:block">
                <Button className="bg-forest hover:bg-forest-light text-white gap-2">
                  <PlusCircle className="h-4 w-4" /> Add Book
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-9 w-9 border border-border-light cursor-pointer">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-ocean text-white">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium text-text-main">
                    {session.user.name}
                  </div>
                  <div className="px-2 pb-2 text-xs text-text-muted truncate">
                    {session.user.email}
                  </div>
                  <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-forest hover:text-forest-light hover:bg-forest/5">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-forest hover:bg-forest-light text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}