import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create an initial response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // SAFETY: If variables are missing, don't crash, just proceed
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update the request cookies
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Re-create the response to apply cookie changes
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          // Set the cookies on the response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refresh the user's session
  const { data: { user } } = await supabase.auth.getUser()

  // --- Redirect Logic ---
  const url = request.nextUrl.clone()

  if (user && url.pathname === '/') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (!user && url.pathname.startsWith('/dashboard')) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}