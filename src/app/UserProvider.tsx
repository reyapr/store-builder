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

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}
