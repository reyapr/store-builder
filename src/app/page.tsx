'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { SimpleGrid } from '@chakra-ui/react'

import { getProducts } from '@/app/dashboard/products/actions'
import { useStore } from '@/app/s/[storeName]/useStore'
import { CardProduct, Layout } from '@/components/homepage'
import { IProduct } from '@/interfaces'
import { cartStore } from '@/stores/useCart'

export default function Home() {
  const [query, setQuery] = useState<string>('')
  const {
    data: products,
    isFetching,
    error,
    refetch
  } = getProducts({ q: query })
  const cart = useStore(cartStore, (state) => state, 'app')
  const sortProducts = (a: any, b: any) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1

  const handleUpdateQty = useCallback(
    (productId: string, qty: number) => {
      cart.updateProductQuantity(productId, qty)
    },
    [cart]
  )

  useEffect(() => {
    console.log('useEffect', { query })
    refetch()
  }, [query, refetch])

  const handleAddQty = useCallback(
    (product: IProduct.IProductResponse) => {
      cart.addProduct(IProduct.IProduct.fromData(product))
    },
    [cart]
  )

  const handleRemoveQty = useCallback(
    (productId: string) => {
      cart.reduceQuantity(productId)
    },
    [cart]
  )

  return (
    <Layout
      isFetching={isFetching}
      error={error as Error}
      onSearch={(keyword) => {
        console.log({ keyword })
        setQuery(keyword)
      }}
    >
      {!!products?.length && !isFetching && (
        <SimpleGrid columns={[1, 4]} gap={6}>
          {products.sort(sortProducts).map((product) => (
            <CardProduct
              qty={
                cart.getTotalQuantity ? cart.getTotalQuantity(product.id) : 0
              }
              onUpdateQty={(qty) => handleUpdateQty(product.id, qty)}
              onAddQty={() => handleAddQty(product)}
              onRemoveQty={() => handleRemoveQty(product.id)}
              product={product}
              key={product.id}
            />
          ))}
        </SimpleGrid>
      )}
    </Layout>
  )
}
