'use client'

import React from 'react'

import { useToast } from '@chakra-ui/react'

import { useGetProduct, useUpdateProducts } from '@/app/admin/products/actions'
import { Layout, ProductForm } from '@/components'

export default function Edit({ params }: Props) {
  const {
    data: product,
    isFetching,
    error,
    refetch
  } = useGetProduct(params.productId)

  const toast = useToast()
  const { mutate: updateProduct, isPending } = useUpdateProducts({
    onSuccess() {
      toast({
        title: 'Berhasil',
        description: 'produk berhasil diupdate',
        status: 'success',
        isClosable: true
      })
      refetch()
    },
    onError() {
      toast({
        title: 'Gagal',
        description: 'produk gagal diupdate',
        status: 'error',
        isClosable: true
      })
    }
  })

  const breadcrumbs = [
    { label: 'dashboard', path: '/admin' },
    { label: 'produk', path: '/admin/products' },
    { label: 'edit', path: '/admin/product' }
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      error={error as Error}
      isFetching={isFetching}
    >
      {product && (
        <ProductForm
          isPending={isPending}
          product={product}
          onUpdate={updateProduct}
          title="Tambah Produk"
        />
      )}
    </Layout>
  )
}

type Props = { params: { productId: string } }
