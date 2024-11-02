'use client'

import React from 'react'

import { Stack, Text } from '@chakra-ui/react'

import { Layout } from '@/components/homepage'

export default function ErrorPage() {
  return (
    <Layout>
      <Stack align="center">
        <Text fontSize="xxx-large">404</Text>
        <Text>Tidak ditemukan</Text>
      </Stack>
    </Layout>
  )
}
