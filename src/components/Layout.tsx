import React, { ReactNode } from 'react'

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  useColorModeValue
} from '@chakra-ui/react'

import { Sidebar } from '@/components'
import { Error, Loading } from '@/components/shared'

export default function Layout({
  children,
  breadcrumbs,
  error,
  isFetching,
  rightHeaderComponent
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
          <Flex
            bg="white"
            borderBottomWidth="1px"
            boxShadow="xs"
            mb={6}
            p={3}
            justifyContent="space-between"
            alignItems="center"
          >
            <Breadcrumb>
              {breadcrumbs.map(({ label, path }) => (
                <BreadcrumbItem key={path}>
                  <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
            <Flex>{rightHeaderComponent}</Flex>
          </Flex>
        )}

        {error && <Error error={error} />}
        {!error && (
          <Flex
            flex={1}
            flexGrow={0}
            direction="column"
            m={3}
            p={3}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            overflowX="auto"
          >
            {isFetching && <Loading />}
            {!error && !isFetching && children}
          </Flex>
        )}
      </Box>
    </HStack>
  )
}

type Props = {
  children: ReactNode
  error?: Error
  isFetching?: boolean
  rightHeaderComponent?: ReactNode
  breadcrumbs?: {
    label: string
    path: string
  }[]
}
