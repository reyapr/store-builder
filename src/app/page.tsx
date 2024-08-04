'use client'

import React, { useState } from 'react'

import { SimpleGrid } from '@chakra-ui/react'

import { CardProduct, Layout } from '@/components/homepage'
import { getProducts } from '@/app/dashboard/products/actions'

export default function Home() {
  const [query, setQuery] = useState('')
  const { data: products, isFetching, error } = getProducts({ query })

  const sortProducts = (a: any, b: any) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1

  return (
    <Layout
      isFetching={isFetching}
      error={error as Error}
      onSearch={(keyword) => setQuery(keyword)}
    >
      {!!products?.length && !isFetching && (
        <SimpleGrid columns={4} gap={6}>
          {products.sort(sortProducts).map((product) => (
            <CardProduct product={product} key={product.id} />
          ))}
        </SimpleGrid>
      )}
    </Layout>
  )
}
