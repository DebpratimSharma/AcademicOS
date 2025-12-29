import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // We check for these because createBrowserClient will throw an error 
  // if they are undefined, which crashes the browser.
  if (!url || !anonKey) {
    throw new Error(
      "Supabase environment variables are missing. " +
      "Check your Vercel Environment Variables configuration."
    );
  }

  return createBrowserClient(url, anonKey)
}