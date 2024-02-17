'use client';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local'})
      document.cookie = 'sb-qviqbtgkunhmasnzbmoh-auth-token-code-verifier=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      if (error) {
        console.error('Error logging out:', error)
      }
      router.push('/login')
    } catch (error) {
      console.log(error, 'error');
    }
  }
  
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
