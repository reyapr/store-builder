'use client';
import { supabase } from "@/app/config/auth-config";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    supabase.auth.getUser()
      .then(user => {
        console.log(user, '<=================== user ==================');
      })
      
  }, [])
  
  const handleLogout = async () => {
    try {
      console.log( '<=================== handle logout ==================');
      const { error } = await supabase.auth.signOut({ scope: 'local'})
      if (error) {
        console.error('Error logging out:', error)
      }
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
