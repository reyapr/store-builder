'use client'

import React from 'react'

import { Box, Center, Text, Stack, Image } from '@chakra-ui/react'
import Link from 'next/link'

import { IProductResponse } from '@/interfaces/product'
import { toIDRFormat } from '@/utils/idr-format'

export default function CardProduct({ product, editable = false }: Props) {
  const { id, name, price, store, imageUrl } = product
  return (
    <Center>
      <Box
        role="group"
        w="full"
        bg="gray.100"
        boxShadow="md"
        rounded="lg"
        pos="relative"
        zIndex={1}
      >
        <Image
          roundedTopLeft="lg"
          roundedTopRight="lg"
          height={160}
          width="full"
          objectFit="cover"
          src={imageUrl}
          alt="#"
        />

        <Stack align="left" p={6}>
          <Link href={`/s/${store.name}`}>
            <Text color="gray.500" fontSize="sm" textTransform="uppercase">
              {store.name}
            </Text>
          </Link>
          <Text fontSize="md" fontFamily="body" noOfLines={1}>
            {name}
          </Text>
          <Text fontSize="sm">{toIDRFormat(price)}</Text>
        </Stack>
      </Box>
    </Center>
  )
}

interface Props {
  product: IProductResponse
  editable?: boolean
}
