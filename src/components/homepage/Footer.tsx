'use client'

import React from 'react'

import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import Link from 'next/link'
import { MdOutlineDashboard } from 'react-icons/md'

export default function SmallWithLogoLeft() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2024 BAF Kitchen</Text>
        <Link href="/dashboard">
          <MdOutlineDashboard />
        </Link>
      </Container>
    </Box>
  )
}
