"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.email({ email, password });

    if (error) {
      toast.error(error.message || "Invalid email or password.");
      setLoading(false);
      return;
    }

    toast.success("Logged in successfully!");
    router.push(redirectTo);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // BetterAuth-এর জন্য signIn.social ব্যবহার করা বাধ্যতামূলক
      const { data, error } = await signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
        setGoogleLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      toast.error("Something went wrong. Check console.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg bg-white border-border-light">
        <div className="mb-8 flex flex-col items-center">
          <BookOpen className="h-10 w-10 text-forest mb-2" />
          <h1 className="text-2xl font-bold text-forest font-serif">Welcome Back</h1>
          <p className="text-sm text-text-muted">Login to your BookNook account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-main">Email</label>
            <Input name="email" type="email" required placeholder="john@example.com" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-main">Password</label>
            <Input name="password" type="password" required placeholder="Your password" className="mt-1" />
          </div>

          <Button type="submit" disabled={loading || googleLoading} className="w-full bg-forest hover:bg-forest-light">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <hr className="flex-1 border-border-light" />
          <span className="text-xs text-text-muted">OR</span>
          <hr className="flex-1 border-border-light" />
        </div>

        <Button 
          onClick={handleGoogleLogin} 
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
          Don't have an account? <Link href="/register" className="text-forest font-semibold hover:underline">Register</Link>
        </p>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}