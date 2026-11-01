import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-light bg-forest text-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-terracotta" />
              <span className="font-serif text-2xl font-bold">BookNook</span>
            </Link>
            <p className="text-sm text-cream/80 leading-relaxed">
              A small online library. Add a book, borrow a book, return a book. Your gateway to knowledge.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-terracotta">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/books" className="hover:text-white transition-colors">All Books</Link></li>
              <li><Link href="/add-book" className="hover:text-white transition-colors">Add Book</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-terracotta">
              Follow Us
            </h3>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-terracotta">
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +880 1234 567890
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> hello@booknook.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-cream/20 pt-6 text-center text-sm text-cream/60">
          © {new Date().getFullYear()} BookNook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}