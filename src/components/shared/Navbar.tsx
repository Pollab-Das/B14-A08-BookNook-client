"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { 
  BookOpen, 
  LogOut, 
  PlusCircle, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  Settings 
} from "lucide-react"; // 👈 User এবং Settings আইকন যোগ করা হলো
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-gray-800 bg-cream/90 dark:bg-[#121212]/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <BookOpen className="h-6 w-6 text-forest dark:text-terracotta" />
          <span className="font-serif text-2xl font-bold tracking-tight text-forest dark:text-cream">
            BookNook
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-forest dark:hover:text-terracotta ${
                pathname === link.href ? "text-forest dark:text-terracotta" : "text-text-muted dark:text-gray-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {session && privateLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-forest dark:hover:text-terracotta ${
                pathname === link.href ? "text-forest dark:text-terracotta" : "text-text-muted dark:text-gray-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Auth & Theme Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-border-light/50 dark:bg-gray-800 text-text-main dark:text-gray-300 hover:bg-border-light dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" /> }
          </button>

          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-border-light dark:bg-gray-700" />
          ) : session ? (
            <>
              <Link href="/add-book" className="hidden sm:block">
                <Button className="bg-forest hover:bg-forest-light dark:bg-terracotta dark:hover:bg-[#a37f6c] text-white gap-2 transition-colors">
                  <PlusCircle className="h-4 w-4" /> Add Book
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none hidden sm:block">
                  <Avatar className="h-9 w-9 border-2 border-border-light dark:border-gray-700 cursor-pointer">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-ocean text-white dark:bg-gray-600">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                
                {/* 👇 My Profile এবং Settings যোগ করা হলো */}
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#1e1e1e] border border-border-light dark:border-gray-800 shadow-xl rounded-xl p-2">
                  <div className="px-2 py-2 mb-1 border-b border-border-light dark:border-gray-800">
                    <p className="text-sm font-bold text-forest dark:text-cream truncate">{session.user.name}</p>
                    <p className="text-xs text-text-muted dark:text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer gap-2 text-text-main dark:text-gray-300 focus:bg-cream dark:focus:bg-gray-800">
                      <User className="h-4 w-4" /> My Profile
                    </DropdownMenuItem>
                  </Link>
                  
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer gap-2 text-text-main dark:text-gray-300 focus:bg-cream dark:focus:bg-gray-800">
                      <Settings className="h-4 w-4" /> Settings
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 mt-1" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" className="text-forest dark:text-cream hover:text-forest-light dark:hover:text-terracotta dark:hover:bg-gray-800">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button className="bg-forest hover:bg-forest-light dark:bg-terracotta dark:hover:bg-[#a37f6c] text-white">
                  Register
                </Button>
              </Link>
            </>
          )}

          <button 
            className="md:hidden z-50 p-1 text-forest dark:text-cream"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#121212] border-b border-border-light dark:border-gray-800 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-6 space-y-6">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-forest dark:text-cream"
                >
                  {link.label}
                </Link>
              ))}
              {session && privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-forest dark:text-cream"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <hr className="border-border-light dark:border-gray-800" />

            <div className="flex flex-col space-y-3">
              {session ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 border border-border-light dark:border-gray-700">
                      <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback className="bg-ocean text-white">{session.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-forest dark:text-cream">{session.user.name}</p>
                      <p className="text-xs text-text-muted dark:text-gray-400">{session.user.email}</p>
                    </div>
                  </div>
                  
                  {/* মোবাইলের জন্যও My Profile অপশন */}
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start border-border-light dark:border-gray-700 text-forest dark:text-cream gap-2">
                      <User className="h-4 w-4" /> My Profile
                    </Button>
                  </Link>

                  <Button onClick={handleSignOut} variant="destructive" className="w-full mt-2">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-forest text-forest dark:border-cream dark:text-cream">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-forest text-white dark:bg-terracotta">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}