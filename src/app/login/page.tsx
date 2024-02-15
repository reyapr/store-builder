'use client'
import { supabase } from "@/app/config/auth-config";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  
  const router = useRouter()
  
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/'
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