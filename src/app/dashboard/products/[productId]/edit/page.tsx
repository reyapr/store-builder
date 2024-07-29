'use client'

import React from 'react'
import { Layout, ProductForm } from '@/components'

import { getProduct } from '../../useGetProduct'

export default function Edit({ params }: Props) {
  const { data, isFetching, error } = getProduct(params.productId)

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
            name: data?.name,
            price: String(data?.price),
            stock: data?.stock,
            storeId: data?.storeId,
            categories: [],
            description: data?.description,
            image: null,
            imageUrl: data.imageUrl
          }}
          onSubmit={() => {}}
          title="Tambah Produk"
        />
      )}
    </Layout>
  )
}

type Props = { params: { productId: string } }
