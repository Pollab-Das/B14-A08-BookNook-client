import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [jwt()],
  // 👇 এখানে আপনার সব Vercel ডোমেইন যোগ করুন
  trustedOrigins: [
    "http://localhost:3000",
    "https://b14-a08-book-nook-client.vercel.app",
    "https://b14-a08-book-nook-client-git-main-b14-a5-dev-stack.vercel.app",
    // চাইলে Vercel-এর সব প্রিভিউ ডোমেইন অ্যালাউ করতে:
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});