import { ReactNode, type PropsWithChildren } from 'react'
import {
  Alert,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react'

import Sidebar from '@/components/Sidebar'

export default function Layout({
  children,
  breadcrumbs,
  error,
  isFetching
}: Props) {
  return (
    <HStack align="start" spacing={0}>
      <Sidebar />
      <Box
        as="main"
        ml={{ base: 0, lg: '60' }}
        w="full"
        minH="90vh"
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        {!!breadcrumbs?.length && (
          <Box bg="white" borderBottomWidth="1px" boxShadow="xs" mb={6} p={3}>
            <Breadcrumb>
              {breadcrumbs.map(({ label, path }) => (
                <BreadcrumbItem key={path}>
                  <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </Box>
        )}
        <Box m={3} p={3} bg="white" boxShadow="md" minH="80vh">
          {error && (
            <Alert status="error" mb={3} height="48px">
              <AlertIcon />
              {error.message}
            </Alert>
          )}
          {isFetching && (
            <Flex
              flex={1}
              justify="center"
              color="blue.400"
              align="center"
              minH="80vh"
            >
              <Spinner />
            </Flex>
          )}

          {!error && !isFetching && children}
        </Box>
      </Box>
    </HStack>
  )
}

type Props = {
  children: ReactNode
  error?: Error
  isFetching?: boolean
  breadcrumbs?: {
    label: string
    path: string
  }[]
}
