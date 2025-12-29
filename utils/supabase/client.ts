import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If variables are missing, we return a dummy client or throw a 
  // clearer error that doesn't crash the prerenderer.
  if (!url || !anonKey) {
    console.warn("Supabase credentials not found. This is expected during some build phases.");
    // Return a dummy client to satisfy the build process
    return createBrowserClient("https://placeholder.supabase.co", "placeholder");
  }

  return createBrowserClient(url, anonKey);
}