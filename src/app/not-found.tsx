import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <BookX className="h-24 w-24 text-terracotta mb-6" />
      <h1 className="font-serif text-4xl font-bold text-forest mb-4">Page Not Found</h1>
      <p className="text-text-muted mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved to another shelf.
      </p>
      <Link href="/">
        <Button className="bg-forest hover:bg-forest-light px-8">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}