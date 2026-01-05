'use client'
import { createClient } from '@/utils/supabase/client'
import { ArrowRight } from 'lucide-react'

interface LoginButtonProps{
  children?: React.ReactNode;
}

export default function LoginButton({
  children,
}:
  LoginButtonProps
) {
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

  if(children)
    return(
        <div onClick={signInWithGoogle} className="cursor-pointer">{children}</div>
  )

  return (
    <button
      onClick={signInWithGoogle}
      className="bg-foreground flex items-center gap-2 text-background hover:bg-background hover:text-foreground text-sm font-medium transition-all bg-wh px-3 py-1.5 rounded-full border-foreground border  ">
    
      <span className='flex items-center gap-2'>
        Sign in <ArrowRight className="w-4 h-4" />
      </span>
      
    </button>
  )
}