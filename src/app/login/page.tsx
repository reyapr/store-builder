'use client'
import { createClient } from "@/utils/supabase/client";

const LoginPage = () => {
  const supabase = createClient()
  
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`
        }
      })
      if (error) {
        console.error('Error signing in with Google', error)
      } else {
        console.log('User:', data)
      }
    } catch (error) {
      console.log(error, 'error');
      
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