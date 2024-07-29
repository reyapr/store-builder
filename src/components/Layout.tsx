import { type PropsWithChildren } from 'react'
import { Box, HStack, useColorModeValue } from '@chakra-ui/react'

import Sidebar from '@/components/Sidebar'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <HStack align="start" spacing={0}>
      <Sidebar />
      <Box
        p={3}
        as="main"
        ml={{ base: 0, lg: '60' }}
        w="full"
        minH="90vh"
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        {children}
      </Box>
    </HStack>
  )
}
