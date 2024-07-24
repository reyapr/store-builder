'use client'
import { createClient } from '@/utils/supabase/client'

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/api/auth/callback`.
  url =
    url.charAt(url.length - 1) === '/'
      ? url + 'api/auth/callback'
      : `${url}/api/auth/callback`
  console.log('url')
  return url
}

const LoginPage = () => {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getURL()
        }
      })
      if (error) {
        console.error('Error signing in with Google', error)
      } else {
        console.log('User:', data)
      }
    } catch (error) {
      console.log(error, 'error')
    }
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleGoogleLogin}>Google Login</button>
    </div>
  )
}

export default LoginPage
