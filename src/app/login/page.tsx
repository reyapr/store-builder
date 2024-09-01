'use client'

import React, { useState } from 'react'

import {
  Flex,
  Stack,
  Heading,
  useColorModeValue,
  Input,
  Button,
  Text,
  Link
} from '@chakra-ui/react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC7zWfKjaT1kIiuzyU8SDXUmVC381oywXw',
  authDomain: 'bafstore-f2842.firebaseapp.com',
  projectId: 'bafstore-f2842',
  storageBucket: 'bafstore-f2842.appspot.com',
  messagingSenderId: '459650481467',
  appId: '1:459650481467:web:c063c8973d303e2a7bcb1e',
  measurementId: 'G-0EQKXM9ZY0'
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function SimpleCard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleEmailPasswordAuth = async () => {
    try {
      let userCredential
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        console.log('User signed up:', userCredential.user)
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log('User signed in:', userCredential.user)
      }
      // Here you can redirect the user or update your app state
    } catch (error) {
      console.error(
        `Error ${isSignUp ? 'signing up' : 'signing in'} with email/password`,
        error
      )
      setError((error as Error).message)
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>
            Customer {isSignUp ? 'Sign Up' : 'Login'}
          </Heading>
        </Stack>
        <Stack
          align={'center'}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4} width="100%">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button onClick={handleEmailPasswordAuth}>
              {isSignUp ? 'Sign Up' : 'Login'}
            </Button>
            {error && <Text color="red.500">{error}</Text>}
            <Text align="center">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link color="blue.500" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  )
}
