'use client'

import React, { useState } from 'react'

import { Flex, Stack, useColorModeValue, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { handleGoogleLogin, saveUserToFirestore } from '@/utils/firebase'

export default function SimpleCard() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    await handleGoogleLogin({
      onError: setError,
      onSuccess: (user) => {
        const { uid, displayName, email, photoURL, phoneNumber } = user
        saveUserToFirestore(
          'customer',
          {
            uid,
            displayName,
            email,
            photoURL,
            phoneNumber
          },
          {
            onError() {
              setError('Error saving user to Firestore')
            },
            onSuccess() {
              router.push('/dashboard/')
            }
          }
        )
      }
    })
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack
          align={'center'}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4} width="100%">
            {error && <Text color="red.500">{error}</Text>}
            <button className="google-sign-in-button" onClick={handleLogin}>
              Login dengan google
            </button>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  )
}
