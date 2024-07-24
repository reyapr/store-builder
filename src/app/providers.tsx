import React from 'react'

import { Box, ChakraBaseProvider, Container } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraBaseProvider>
      <Container maxW="100%" color="white" centerContent>
        <Box padding="4" bg="blue.400" color="black" w="2xl">
          {children}
        </Box>
      </Container>
    </ChakraBaseProvider>
  )
}
