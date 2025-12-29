import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from '@/components/LoginButton'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex flex-col gap-3 items-center justify-center min-h-screen">
      <h1 className='text-3xl'>Welcome to AcademicOS</h1>
      <h2>Class Routine Manager</h2>
      <p>Organize your semester for free.</p>
      <LoginButton />
    </main>
  )
}