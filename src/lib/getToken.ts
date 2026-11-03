import { authClient } from "./auth-client";

// client site used
export const getTokenFromClient = async () => {
  const { data } = await authClient.token();
  return data?.token;
};