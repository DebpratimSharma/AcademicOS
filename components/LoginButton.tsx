'use client'
import { createClient } from '@/utils/supabase/client'

export default function LoginButton() {
  const supabase = createClient()

  const signInWithGoogle = async () => {
  const supabase = createClient()
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // Add this line to force the Google account picker
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline',
      },
    },
  })
}

  return (
    <button 
      onClick={signInWithGoogle}
      className="px-4 py-2 bg-secondary rounded-lg border border-border text-secondary-foreground hover:bg-secondary/80"
    >
      Sign in with Google
    </button>
  )
}