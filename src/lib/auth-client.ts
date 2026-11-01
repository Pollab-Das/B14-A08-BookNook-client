import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // 👇 এখানে 8000 নয়, ফ্রন্টএন্ডের 3000 পোর্ট বা BETTER_AUTH_URL দিতে হবে
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;