'use client'

import React, { useState } from 'react'

import { Center, Flex, Stack, useColorModeValue, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AiFillHome } from 'react-icons/ai'

import { useAuth } from '@/app/UserProvider'
import { handleGoogleLogin, saveUserToFirestore } from '@/utils/firebase'

export default function SimpleCard() {
  const router = useRouter()
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const bgColor2 = useColorModeValue('white', 'gray.700')

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

  if (user) {
    return (
      <Center bg="honeydew" h="100px" color="white">
        Redirecting
      </Center>
    )
  }

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg={bgColor}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack>
          <Link href="/">
            <Flex align="center" gap={1}>
              {`<`}
              <Text>Kembali</Text>
              <AiFillHome />
            </Flex>
          </Link>
        </Stack>
        <Stack
          align={'center'}
          rounded={'lg'}
          bg={bgColor2}
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
