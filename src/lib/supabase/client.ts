"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/**
 * Browser Supabase client, or null when env vars aren't configured —
 * the app then runs in guest-only mode (localStorage progress).
 * Phase 1 is client-side auth only: no server-rendered protected routes,
 * all progress writes happen in the browser.
 */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && anonKey ? createBrowserClient(url, anonKey) : null;
  return client;
}
