'use client'

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  useColorModeValue,
  Text,
  Stack,
  Image
} from '@chakra-ui/react'
import Link from 'next/link'

import { IProduct } from '@/interfaces/product'
import { toIDRFormat } from '@/utils/idr-format'

export default function ProductSimple({ product }: Props) {
  const { id, name, price, stock, store, categories, imageUrl, description } =
    product
  return (
    <Center>
      <Box
        role="group"
        maxW="330px"
        w="full"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="sm"
        rounded="lg"
        pos="relative"
        zIndex={1}
      >
        <Image
          height={160}
          width="full"
          objectFit="cover"
          src={imageUrl}
          alt="#"
        />

        <Stack align="left" p={6}>
          <Text color="gray.500" fontSize="sm" textTransform="uppercase">
            {store.name}
          </Text>
          <Text fontSize="md" fontFamily="body">
            {name}
          </Text>
          <Text fontSize="sm">{toIDRFormat(price)}</Text>
        </Stack>
        <Stack px={6} pb={3}>
          <ButtonGroup gap={2}>
            <Button size="sm" colorScheme="blue">
              <Link href={`/dashboard/products/${id}/edit`}>Edit</Link>
            </Button>
            <Button size="sm" colorScheme="red">
              Delete
            </Button>
          </ButtonGroup>
        </Stack>
      </Box>
    </Center>
  )
}

interface Props {
  product: IProduct
}
