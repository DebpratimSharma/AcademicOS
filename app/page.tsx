import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from '@/components/LoginButton'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1>Class Routine Manager</h1>
      <p>Organize your semester for free.</p>
      <LoginButton />
    </main>
  )
}