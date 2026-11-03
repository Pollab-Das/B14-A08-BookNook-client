"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { LogOut, BookOpen, Clock, CheckCircle2, TrendingUp } from "lucide-react";

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

  // 👇 নামের ওপর ভিত্তি করে ফেক রিডিং স্ট্যাটস জেনারেট করা (যাতে প্রতিবার রিফ্রেশে বদলে না যায়)
  const generateStats = (userName: string) => {
    const charSum = userName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      currentlyReading: (charSum % 3) + 1, // ১ থেকে ৩
      totalBorrowed: (charSum % 15) + 5,   // ৫ থেকে ২০
      returned: (charSum % 10) + 2,        // ২ থেকে ১২
    };
  };

  const stats = generateStats(session.user.name || "User");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-forest dark:text-cream mb-8">My Profile</h1>
      
      {/* 👇 রিডিং স্ট্যাটস সেকশন */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-forest text-white dark:bg-[#1e1e1e] border-none shadow-lg flex flex-col items-center justify-center text-center">
          <BookOpen className="h-8 w-8 text-terracotta mb-2" />
          <h3 className="text-3xl font-bold font-serif">{stats.totalBorrowed}</h3>
          <p className="text-sm text-gray-200 dark:text-gray-400 mt-1">Total Borrowed</p>
        </Card>
        
        <Card className="p-6 bg-white dark:bg-[#1e1e1e] border-border-light dark:border-gray-800 shadow-lg flex flex-col items-center justify-center text-center">
          <Clock className="h-8 w-8 text-ocean mb-2" />
          <h3 className="text-3xl font-bold font-serif text-forest dark:text-cream">{stats.currentlyReading}</h3>
          <p className="text-sm text-text-muted dark:text-gray-400 mt-1">Currently Reading</p>
        </Card>

        <Card className="p-6 bg-white dark:bg-[#1e1e1e] border-border-light dark:border-gray-800 shadow-lg flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="h-8 w-8 text-forest mb-2" />
          <h3 className="text-3xl font-bold font-serif text-forest dark:text-cream">{stats.returned}</h3>
          <p className="text-sm text-text-muted dark:text-gray-400 mt-1">Books Returned</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* বাম দিকের প্রোফাইল কার্ড */}
        <Card className="md:col-span-1 p-6 bg-white dark:bg-[#1e1e1e] border-border-light dark:border-gray-800 shadow-lg flex flex-col items-center text-center h-fit">
          <Avatar className="h-28 w-28 border-4 border-cream dark:border-gray-800 shadow-md">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="bg-ocean text-white text-3xl">
              {session.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold text-forest dark:text-cream mt-4">{session.user.name}</h2>
          <p className="text-sm text-text-muted dark:text-gray-400 mt-1 break-all">{session.user.email}</p>
          
          <div className="w-full border-t border-border-light dark:border-gray-800 mt-6 pt-6">
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 gap-2"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </Card>

        {/* ডান দিকের আপডেট ফর্ম */}
        <Card className="md:col-span-2 p-8 bg-white dark:bg-[#1e1e1e] border-border-light dark:border-gray-800 shadow-lg">
          <h2 className="text-xl font-bold text-forest dark:text-cream mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-terracotta" /> Account Settings
          </h2>
          
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

            <div>
              <label className="text-sm font-medium text-text-main dark:text-gray-300">Bio (Coming Soon)</label>
              <textarea 
                disabled
                placeholder="Tell us about your reading habits..." 
                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm cursor-not-allowed"
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
    </div>
  );
}