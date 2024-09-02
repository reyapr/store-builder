// context/UserContext.tsx
'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'

import { onAuthStateChanged, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'

import { Loading } from '@/components/shared'
import { auth } from '@/utils/firebase'

// Define the shape of the UserContext
interface UserContextType {
  user: User | null
  loading: boolean
}

// Create the UserContext with default values
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true
})

// Create a custom hook to use the UserContext
export const useAuth = () => useContext(UserContext)

// Create a provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      const loginPath = window.location.href.includes('admin')
        ? '/admin/login'
        : 'login'
      router.replace(loginPath)
    }

    if (user) {
      if (window.location.pathname === '/login') {
        router.replace('/dashboard')
      }
      if (window.location.pathname === '/admin/login') {
        router.replace('/admin')
      }
    }
  }, [user, loading, router])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {loading && <Loading />}
      {children}
    </UserContext.Provider>
  )
}
