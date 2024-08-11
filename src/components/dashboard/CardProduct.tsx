'use client'

import React from 'react'

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

import { IProductResponse } from '@/interfaces/product'
import { currency } from '@/utils'

export default function CardProduct({ product, editable = true }: Props) {
  const { id, name, price, store, imageUrl } = product
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
            {store?.name || product.storeId}
          </Text>
          <Text fontSize="md" fontFamily="body">
            {name}
          </Text>
          <Text fontSize="sm">{currency.toIDRFormat(price)}</Text>
        </Stack>
        {editable && (
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
        )}
      </Box>
    </Center>
  )
}

interface Props {
  product: IProductResponse
  editable?: boolean
}
