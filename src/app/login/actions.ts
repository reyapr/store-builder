'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export async function login() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {data,  error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });
    
    if (error) {
      throw new Error('Login failed');
    }

    return true; // Return true upon successful login
  } catch (error) {
    console.error('Login error:', error);
    return false; // Return false if login fails
  }
}
