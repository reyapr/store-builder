'use client'

import React, { useState } from 'react'

import {
  Center,
  Flex,
  Stack,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { handleGoogleLogin, saveUserToFirestore } from '@/utils/firebase'

import { useAuth } from '@/app/UserProvider'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleLogin = async () => {
    await handleGoogleLogin({
      onError: setError,
      onSuccess: (user) => {
        const { uid, displayName, email, photoURL, phoneNumber } = user
        saveUserToFirestore(
          'admin',
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
              router.push('/admin/')
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
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Flex p={6}>
            Harap hubungi admin bazaf untuk mendaftar sebagai vendor.
          </Flex>
        </ModalContent>
      </Modal>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Admin Dashboard</Heading>
        </Stack>
        <Stack
          align={'center'}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            {error && <Text color="red.500">{error}</Text>}
            <button className="google-sign-in-button" onClick={handleLogin}>
              Login dengan google
            </button>
          </Stack>
          <Button my={4} size="xs" onClick={onOpen}>
            Daftar menjadi vendor
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}
