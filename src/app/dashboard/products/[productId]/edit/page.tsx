'use client'

import React from 'react'

import { getProduct, updateProducts } from '@/app/dashboard/products/actions'
import { Layout, ProductForm } from '@/components'

export default function Edit({ params }: Props) {
  const { data, isFetching, error } = getProduct(params.productId)
  const { mutate } = updateProducts()

  const breadcrumbs = [
    { label: 'dashboard', path: '/dashboard' },
    { label: 'produk', path: '/dashboard/products' },
    { label: 'edit - ', path: '/dashboard/product' }
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      error={error as Error}
      isFetching={isFetching}
    >
      {data && (
        <ProductForm
          product={{
            id: params.productId,
            name: data?.name,
            price: String(data?.price),
            stock: data?.stock,
            storeId: data?.storeId,
            categoryIds: [],
            description: data?.description,
            imageUrl: data.imageUrl
          }}
          onSubmit={(product) => mutate(product)}
          title="Tambah Produk"
        />
      )}
    </Layout>
  )
}

type Props = { params: { productId: string } }
