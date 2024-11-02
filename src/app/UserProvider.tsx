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
import { usePathname, useRouter } from 'next/navigation'

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
  const pathname = usePathname()
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
    if (!loading) {
      if (!user) {
        if (pathname.includes('/dashboard')) {
          router.replace('/login')
        }
        if (pathname.includes('/admin')) {
          router.replace('/admin/login')
        }
      }

      if (user) {
        if (pathname === '/login') {
          router.replace('/dashboard')
        }
        if (pathname === '/admin/login') {
          router.replace('/admin')
        }
      }
    }
  }, [user, loading, pathname, router])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {loading ? <Loading /> : children}
    </UserContext.Provider>
  )
}
