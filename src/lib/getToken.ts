import { authClient } from "./auth-client";

// ক্লায়েন্ট সাইডে ব্যবহারের জন্য
export const getTokenFromClient = async () => {
  const { data } = await authClient.token();
  return data?.token;
};