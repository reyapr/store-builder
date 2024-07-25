import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { Flex } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Flex flexDirection="column" height="100vh">
      <Navbar />
      <Flex flexGrow={1}>
        <Sidebar />
        <Flex
          py="16px"
          px="32px"
          flexDirection="column"
          overflow="auto"
          flexGrow={1}
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}
