import React, { ReactNode } from 'react'

import {
  Alert,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'

import { Navbar } from '@/components/homepage'
import { Search2Icon } from '@chakra-ui/icons'

export default function Layout({
  storeName,
  children,
  breadcrumbs,
  error,
  isFetching,
  rightHeaderComponent,
  onSearch
}: Props) {
  return (
    <>
      <Navbar storeName={storeName} />
      <VStack gap={6} mt={6} w={['100%', 1200]} mx="auto" p={[3, 0]}>
        {onSearch && (
          <Stack spacing={4} w="full">
            <InputGroup bg="gray.100" w="full" rounded="2xl">
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="gray.700" />
              </InputLeftElement>
              <Input
                onChange={(e) => onSearch(e.target.value)}
                type="text"
                placeholder="Cari makanan atau resto"
                color="gray.700"
                _placeholder={{ color: 'gray.700' }}
              />
            </InputGroup>
          </Stack>
        )}
        <Box w="full" minH="50vh">
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

          {error && (
            <Box mb={3}>
              <Alert status="error" mb={3} height="48px">
                <AlertIcon />
                {error.message}
              </Alert>
            </Box>
          )}
          {!error && (
            <>
              {isFetching && (
                <Center>
                  <Spinner size="xl" />
                </Center>
              )}

              {!error && !isFetching && children}
            </>
          )}
        </Box>
      </VStack>
    </>
  )
}

type Props = {
  storeName?: string
  children: ReactNode
  error?: Error
  isFetching?: boolean
  rightHeaderComponent?: ReactNode
  onSearch?: (keyword: string) => void
  breadcrumbs?: {
    label: string
    path: string
  }[]
}
