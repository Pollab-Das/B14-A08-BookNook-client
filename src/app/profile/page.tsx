"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // সেশন লোড হলে নাম সেট করা
  useEffect(() => {
    if (session) {
      setName(session.user.name || "");
    }
  }, [session]);

  // প্রোটেকশন: লগইন না থাকলে লগইন পেজে পাঠাবে
  if (isPending) return <div className="text-center py-20 text-text-muted">Loading...</div>;
  if (!session) {
    router.push("/login?redirect=/profile");
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // BetterAuth এর updateUser কল
    const { error } = await authClient.updateUser({
      name: name,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message || "Failed to update profile.");
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-forest dark:text-cream mb-8">My Profile</h1>
      
      {/* প্রোফাইল কার্ড */}
      <Card className="p-8 bg-white dark:bg-[#1e1e1e] border-border-light dark:border-gray-800 shadow-lg">
        
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8 border-b border-border-light dark:border-gray-800 pb-8">
          <Avatar className="h-24 w-24 border-4 border-cream dark:border-gray-800 shadow-md">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="bg-ocean text-white text-2xl">
              {session.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-forest dark:text-cream">{session.user.name}</h2>
            <p className="text-text-muted dark:text-gray-400 mt-1">{session.user.email}</p>
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="mt-4 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 gap-2"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* তথ্য আপডেট ফর্ম */}
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-text-main dark:text-gray-300">Full Name</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name" 
              className="mt-1 dark:bg-gray-900 dark:border-gray-700" 
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-text-main dark:text-gray-300">Email Address (Read Only)</label>
            <Input 
              value={session.user.email} 
              disabled 
              className="mt-1 bg-gray-100 dark:bg-gray-800 text-text-muted cursor-not-allowed" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={saving} 
            className="w-full bg-forest hover:bg-forest-light text-white dark:bg-terracotta dark:hover:bg-[#a37f6c] h-11 text-base mt-4 font-semibold"
          >
            {saving ? "Saving..." : "Update Profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}