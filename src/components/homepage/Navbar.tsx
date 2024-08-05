'use client'

import React from 'react'

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Tag
} from '@chakra-ui/react'
import Link from 'next/link'
import { FaCartShopping } from 'react-icons/fa6'

import { useStore } from '@/app/s/[storeName]/useStore'
import { cartStore } from '@/stores/useCart'

interface navLinkProps {
  children: React.ReactNode
}

// eslint-disable-next-line no-unused-vars
const NavLink = (props: navLinkProps) => {
  const { children } = props
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700')
      }}
      href={'#'}
    >
      {children}
    </Box>
  )
}

export default function Navbar({ storeName }: Props) {
  const cart = useStore(cartStore, (state) => state, 'app')
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box bg={useColorModeValue('white', 'white')} px={4} dropShadow="sm">
      <Flex
        h={16}
        w={['100%', 1200]}
        mx="auto"
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          {storeName ? (
            <Link href={`/s/${storeName}`}>
              <Box>{storeName}</Box>
            </Link>
          ) : (
            <Link href={`/`}>
              <Box>BAF Kitchen</Box>
            </Link>
          )}
        </HStack>
        <Flex alignItems={'center'}>
          <Flex position="relative">
            <Link href="/cart">
              <Tag
                rounded="full"
                colorScheme="red"
                position="absolute"
                top={-2}
                right={-3}
                size="sm"
              >
                {cart.getTotalQuantity && cart.getTotalQuantity()}
              </Tag>
              <FaCartShopping color="green" size={24} />
            </Link>
          </Flex>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}></Stack>
        </Box>
      ) : null}
    </Box>
  )
}

type Props = { storeName?: string }
