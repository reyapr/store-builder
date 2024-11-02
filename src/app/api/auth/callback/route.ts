import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { prisma } from '@/app/api/config'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const { searchParams, origin } = url
  const code = searchParams.get('code')
  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          }
        }
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    const { data } = await supabase.auth.getSession()
    const customerParams = {
      name: data.session?.user?.user_metadata?.full_name,
      email: data.session?.user?.email || '',
      phoneNumber: data.session?.user?.user_metadata?.phone_number || ''
    }

    try {
      await prisma.customer.upsert({
        where: {
          email: customerParams.email // Assuming email is unique
        },
        update: {
          ...customerParams
        },
        create: {
          ...customerParams
        }
      })
      console.log("---------------------------2")
      return NextResponse.redirect(`${origin}/admin`)
    } catch (err) {
      console.log("---------------------------3")
      console.log({ err })
      return NextResponse.json([err, error], { status: 500 })
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/error`)
}
