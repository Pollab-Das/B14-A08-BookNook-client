"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client"; // signIn ইমপোর্ট করা হলো
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as string;
    const password = formData.get("password") as string;

    // Password Validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false); return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      setLoading(false); return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      setLoading(false); return;
    }

    const { error } = await signUp.email({ email, password, name, image });

    if (error) {
      toast.error(error.message || "Registration failed.");
      setLoading(false); return;
    }

    toast.success("Account created successfully! Please login.");
    router.push("/login");
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      // গুগল সাইনআপের জন্যও signIn.social ব্যবহার করতে হবে
      const { data, error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google signup failed.");
        setGoogleLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Google Sign Up Error:", err);
      toast.error("Something went wrong. Check console.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg bg-white border-border-light">
        <div className="mb-8 flex flex-col items-center">
          <BookOpen className="h-10 w-10 text-forest mb-2" />
          <h1 className="text-2xl font-bold text-forest font-serif">Create an Account</h1>
          <p className="text-sm text-text-muted">Join BookNook to borrow and share books.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-main">Name</label>
            <Input name="name" required placeholder="John Doe" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-main">Email</label>
            <Input name="email" type="email" required placeholder="john@example.com" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-main">Photo URL (Optional)</label>
            <Input name="image" type="url" placeholder="https://example.com/photo.jpg" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-main">Password</label>
            <Input name="password" type="password" required placeholder="Min 6 chars, 1 Uppercase, 1 Lowercase" className="mt-1" />
          </div>

          <Button type="submit" disabled={loading || googleLoading} className="w-full bg-forest hover:bg-forest-light dark:bg-terracotta dark:hover:bg-[#a37f6c] text-white h-11 text-base font-semibold mt-2">
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <hr className="flex-1 border-border-light" />
          <span className="text-xs text-text-muted">OR</span>
          <hr className="flex-1 border-border-light" />
        </div>

        <Button 
          onClick={handleGoogleSignUp} 
          disabled={googleLoading || loading}
          variant="outline" 
          className="w-full border-border-light gap-2"
        >
          {googleLoading ? (
            "Redirecting to Google..."
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              Continue with Google
            </>
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account? <Link href="/login" className="text-forest font-semibold hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}