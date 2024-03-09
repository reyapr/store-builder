import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DASHBOARD_LOGIN_PATH } from "@/constants/auth";

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local'})
      document.cookie = 'sb-qviqbtgkunhmasnzbmoh-auth-token-code-verifier=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      if (error) {
        console.error('Error logging out:', error)
      }
      router.push(DASHBOARD_LOGIN_PATH)
    } catch (error) {
      console.log(error, 'error');
    }
  }
  
  return (
    <div>
      <div style={{ display: 'flex'}}>
        <Link href="/" style={{ flex: 11 }}>Home</Link>
        <button style={{ flex: 1, backgroundColor: '#a1baa0'}} onClick={handleLogout}>Logout</button>
      </div>
      <hr />
    </div>
  )
}