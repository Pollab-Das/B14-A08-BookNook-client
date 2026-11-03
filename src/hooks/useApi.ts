"use client";

import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useApi() {
  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const { data } = await authClient.token();
    const token = data?.token;

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // JSON ki na chek kore
    const text = await res.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (err) {
      throw new Error(`Server Error (${res.status}): Expected JSON but received HTML. Check if server is running and CLIENT_URL is correct.`);
    }

    if (!res.ok) throw new Error(result.msg || "Something went wrong");
    return result;
  };

  return { fetchWithAuth };
}