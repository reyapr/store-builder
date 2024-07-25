import React from 'react'

import { Text } from '@chakra-ui/layout'

import { Providers } from './providers'

export default function Home() {
  return (
    <Providers>
      <Text color="white">Home Page</Text>
    </Providers>
  )
}
