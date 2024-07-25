'use client'

import {
  Flex,
  Stack,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'

import { createClient } from '@/utils/supabase/client'

export default function SimpleCard() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/'

    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`
    // Make sure to include a trailing `/api/auth/callback`.
    url =
      url.charAt(url.length - 1) === '/'
        ? url + 'api/auth/callback'
        : `${url}/api/auth/callback`
    console.log('url')
    return url
  }

  const supabase = createClient()

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getURL()
        }
      })
      if (error) {
        console.error('Error signing in with Google', error)
      } else {
        console.log('User:', data)
      }
    } catch (error) {
      console.log(error, 'error')
    }
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
            <button
              className="google-sign-in-button"
              onClick={handleGoogleLogin}
            >
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
